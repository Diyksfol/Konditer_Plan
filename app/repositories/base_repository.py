from sqlalchemy.orm import Session


class BaseRepository:

    def __init__(self, model):
        self.model = model

    def get_all(self, db: Session):
        return db.query(self.model).all()

    def get_by_id(self, db: Session, entity_id: int):
        return db.query(self.model).filter(
            self.model.__table__.primary_key.columns.values()[0] == entity_id
        ).first()

    def create(self, db: Session, data: dict):
        obj = self.model(**data)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    def update(self, db: Session, entity_id: int, data: dict):
        obj = self.get_by_id(db, entity_id)
        if not obj:
            return None

        for key, value in data.items():
            setattr(obj, key, value)

        db.commit()
        db.refresh(obj)
        return obj

    def delete(self, db: Session, entity_id: int):
        obj = self.get_by_id(db, entity_id)
        if not obj:
            return False

        db.delete(obj)
        db.commit()
        return True