class BaseService:

    def __init__(self, repo):
        self.repo = repo

    def get_all(self, db):
        return self.repo.get_all(db)

    def get_by_id(self, db, entity_id):
        return self.repo.get_by_id(db, entity_id)

    def create(self, db, data):
        return self.repo.create(db, data)

    def update(self, db, entity_id, data):
        return self.repo.update(db, entity_id, data)

    def delete(self, db, entity_id):
        return self.repo.delete(db, entity_id)

    