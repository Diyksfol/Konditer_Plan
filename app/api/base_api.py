from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db


class BaseAPI:
    def __init__(self, service):
        self.router = APIRouter()
        self.service = service

        self._register_routes()

    def _register_routes(self):

        # GET ALL
        @self.router.get("/")
        def get_all(db: Session = Depends(get_db)):
            return self.service.get_all(db)

        # GET BY ID
        @self.router.get("/{entity_id}")
        def get_one(entity_id: int, db: Session = Depends(get_db)):
            obj = self.service.get_by_id(db, entity_id)
            if not obj:
                raise HTTPException(status_code=404, detail="Not found")
            return obj

        # CREATE
        @self.router.post("/")
        def create(data, db: Session = Depends(get_db)):
            return self.service.create(db, data)

        # UPDATE
        @self.router.put("/{entity_id}")
        def update(entity_id: int, data: dict, db: Session = Depends(get_db)):
            obj = self.service.update(db, entity_id, data)
            if not obj:
                raise HTTPException(status_code=404, detail="Not found")
            return obj

        # DELETE
        @self.router.delete("/{entity_id}")
        def delete(entity_id: int, db: Session = Depends(get_db)):
            success = self.service.delete(db, entity_id)
            if not success:
                raise HTTPException(status_code=404, detail="Not found")
            return {"message": "Deleted"}