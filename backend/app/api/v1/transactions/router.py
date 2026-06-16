from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies.databae import get_db
from app.models.category import Category
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionRead

router = APIRouter(prefix="/transactions", tags=["transactions"])


def _category_name(transaction: Transaction, db: Session) -> str | None:
    if transaction.category_id is None:
        return None

    category = db.query(Category).filter(Category.id == transaction.category_id).first()
    return category.name if category else None


def _with_category(transaction: Transaction, db: Session) -> Transaction:
    transaction.category = _category_name(transaction, db)
    return transaction


def _category_id_from_payload(payload: TransactionCreate, db: Session) -> int | None:
    category_id = payload.category_id
    if payload.category:
        category = db.query(Category).filter(Category.name == payload.category).first()
        if not category:
            category = Category(name=payload.category, type=payload.type)
            db.add(category)
            db.flush()
        category_id = category.id
    return category_id


@router.post("/", response_model=TransactionRead)
def create_transaction(*, payload: TransactionCreate, db: Session = Depends(get_db)) -> TransactionRead:
    transaction = Transaction(
        user_id=payload.user_id,
        category_id=_category_id_from_payload(payload, db),
        amount=payload.amount,
        type=payload.type,
        note=payload.note,
        transaction_date=payload.transaction_date,
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return _with_category(transaction, db)


@router.put("/{transaction_id}", response_model=TransactionRead)
def update_transaction(
    transaction_id: int,
    *,
    payload: TransactionCreate,
    db: Session = Depends(get_db),
) -> TransactionRead:
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    transaction.user_id = payload.user_id
    transaction.category_id = _category_id_from_payload(payload, db)
    transaction.amount = payload.amount
    transaction.type = payload.type
    transaction.note = payload.note
    transaction.transaction_date = payload.transaction_date

    db.commit()
    db.refresh(transaction)
    return _with_category(transaction, db)


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)) -> None:
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    db.delete(transaction)
    db.commit()


@router.get("/", response_model=list[TransactionRead])
def list_transactions(db: Session = Depends(get_db)) -> list[TransactionRead]:
    transactions = db.query(Transaction).all()
    return [_with_category(transaction, db) for transaction in transactions]


@router.get("/{transaction_id}", response_model=TransactionRead)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)) -> TransactionRead:
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return _with_category(transaction, db)
