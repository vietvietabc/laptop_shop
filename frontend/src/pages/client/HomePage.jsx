import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { productsApi } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    factory: '',
    target: '',
    sort: ''
  });
  const { addToCart } = useCart();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsApi.getAll(filters);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (error) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <Container className="py-4">
      {/* Filters */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm..."
            value={filters.keyword}
            onChange={(e) => setFilters({...filters, keyword: e.target.value})}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={filters.factory}
            onChange={(e) => setFilters({...filters, factory: e.target.value})}
          >
            <option value="">Tất cả hãng</option>
            <option value="ASUS">ASUS</option>
            <option value="DELL">DELL</option>
            <option value="LENOVO">LENOVO</option>
            <option value="HP">HP</option>
            <option value="ACER">ACER</option>
            <option value="MSI">MSI</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form. Select
            value={filters.target}
            onChange={(e) => setFilters({...filters, target: e.target.value})}
          >
            <option value="">Tất cả loại</option>
            <option value="GAMING">Gaming</option>
            <option value="SINHVIEN-VANPHONG">Sinh viên - Văn phòng</option>
            <option value="THIET-KE-DO-HOA">Thiết kế đồ họa</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filters.sort}
            onChange={(e) => setFilters({...filters, sort: e.target.value})}
          >
            <option value="">Sắp xếp</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="newest">Mới nhất</option>
          </Form. Select>
        </Col>
      </Row>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product.id} lg={3} md={4} sm={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Link to={`/product/${product.id}`}>
                  <Card.Img
                    variant="top"
                    src={product.image ?  `http://localhost:8000/uploads/${product.image}` : '/placeholder.jpg'}
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                </Link>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-6">
                    <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                      {product.name}
                    </Link>
                  </Card.Title>
                  <Card.Text className="text-primary fw-bold mt-auto">
                    {formatPrice(product.price)}
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="flex-grow-1"
                      onClick={() => handleAddToCart(product. id)}
                    >
                      <FaShoppingCart /> Thêm
                    </Button>
                    <Button variant="outline-danger" size="sm">
                      <FaHeart />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default HomePage;