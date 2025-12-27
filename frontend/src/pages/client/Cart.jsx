import { Container, Row, Col, Card, Button, Table, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = async (productId, action) => {
    try {
      await updateQuantity(productId, action);
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleRemove = async (cartDetailId) => {
    try {
      await removeItem(cartDetailId);
      toast.success('Đã xóa sản phẩm');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Đã xóa giỏ hàng');
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  if (cart.items.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h3>Giỏ hàng trống</h3>
        <p>Hãy thêm sản phẩm vào giỏ hàng!</p>
        <Button as={Link} to="/" variant="primary">
          Tiếp tục mua sắm
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Giỏ hàng của bạn</h2>
      
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Tổng</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart. items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <Image
                            src={item.product.image ? `http://localhost:8000/uploads/${item.product.image}` : '/placeholder.jpg'}
                            alt={item.product.name}
                            width={60}
                            height={60}
                            className="me-3"
                            style={{ objectFit: 'cover' }}
                          />
                          <span>{item.product.name}</span>
                        </div>
                      </td>
                      <td>{formatPrice(item.price)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, 'decrease')}
                          >
                            <FaMinus />
                          </Button>
                          <span className="mx-3">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleQuantityChange(item.product.id, 'increase')}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </td>
                      <td>{formatPrice(item.total)}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemove(item.id)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              <Button variant="outline-danger" onClick={handleClearCart}>
                Xóa giỏ hàng
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card>
            <Card.Body>
              <h5>Tổng đơn hàng</h5>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính:</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Phí vận chuyển:</span>
                <span>Miễn phí</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Tổng cộng:</strong>
                <strong className="text-primary">{formatPrice(cart.total)}</strong>
              </div>
              <Button 
                variant="primary" 
                className="w-100"
                onClick={() => navigate('/checkout')}
              >
                Thanh toán
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;