from app.api.base_api import BaseAPI
from app.services.order_service import OrderService


order_api = BaseAPI( service=OrderService() )

router = order_api.router