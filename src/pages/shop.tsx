import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Search, ShoppingCart, Download, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "@/lib/db-service";
import { fine } from "@/lib/fine";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: session } = fine.auth.useSession();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const productsData = await getProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        // Load cart from localStorage
        const savedCart = localStorage.getItem('soulseer-cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          setCartCount(parsedCart.reduce((total, item) => total + item.quantity, 0));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [toast]);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const addToCart = (product) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    let updatedCart;
    if (existingItemIndex >= 0) {
      // Item already in cart, increase quantity
      updatedCart = [...cartItems];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1
      };
    } else {
      // Add new item to cart
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }
    
    setCartItems(updatedCart);
    setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0));
    
    // Save to localStorage
    localStorage.setItem('soulseer-cart', JSON.stringify(updatedCart));
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const viewCart = () => {
    navigate('/shop/cart');
  };
  
  // Filter products by type
  const physicalProducts = filteredProducts.filter(product => 
    product.category !== 'Digital' && product.category !== 'Services'
  );
  
  const digitalProducts = filteredProducts.filter(product => 
    product.category === 'Digital'
  );
  
  const services = filteredProducts.filter(product => 
    product.category === 'Services'
  );

  return (
    <div className="app-background min-h-screen flex flex-col dark">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="glass-effect rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="alex-brush text-4xl pink-text mb-4 md:mb-0 header-glow">Spiritual Shop</h1>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10 bg-background/50 w-full md:w-64"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="relative border-primary text-primary hover:bg-primary/10"
                onClick={viewCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="physical" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="physical" className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Physical Products
              </TabsTrigger>
              <TabsTrigger value="digital" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Digital Products
              </TabsTrigger>
              <TabsTrigger value="services">
                Services
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="physical">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : physicalProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {physicalProducts.map((product) => (
                    <Card key={product.id} className="glass-effect border-0 overflow-hidden">
                      <div className="relative">
                        <img 
                          src={product.imageUrl || "https://via.placeholder.com/300"} 
                          alt={product.name} 
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-primary/90">{product.category}</Badge>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-lg">{product.name}</CardTitle>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <p className="text-gray-300 text-sm line-clamp-2">{product.description}</p>
                        <p className="text-xl font-semibold text-primary mt-2">${product.price.toFixed(2)}</p>
                      </CardContent>
                      
                      <CardFooter className="pt-0 pb-4 flex gap-2">
                        <Button 
                          className="flex-1 bg-primary/90 hover:bg-primary"
                          onClick={() => navigate(`/shop/product/${product.id}`)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-primary text-primary hover:bg-primary/10"
                          onClick={() => addToCart(product)}
                          disabled={product.inventory <= 0}
                        >
                          {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No physical products found.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="digital">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : digitalProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {digitalProducts.map((product) => (
                    <Card key={product.id} className="glass-effect border-0 overflow-hidden">
                      <div className="relative">
                        <img 
                          src={product.imageUrl || "https://via.placeholder.com/300"} 
                          alt={product.name} 
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-blue-500">{product.category}</Badge>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-lg">{product.name}</CardTitle>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <p className="text-gray-300 text-sm line-clamp-2">{product.description}</p>
                        <p className="text-xl font-semibold text-primary mt-2">${product.price.toFixed(2)}</p>
                      </CardContent>
                      
                      <CardFooter className="pt-0 pb-4 flex gap-2">
                        <Button 
                          className="flex-1 bg-primary/90 hover:bg-primary"
                          onClick={() => navigate(`/shop/product/${product.id}`)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-primary text-primary hover:bg-primary/10"
                          onClick={() => addToCart(product)}
                        >
                          Buy Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No digital products found.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="services">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : services.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {services.map((product) => (
                    <Card key={product.id} className="glass-effect border-0 overflow-hidden">
                      <div className="relative">
                        <img 
                          src={product.imageUrl || "https://via.placeholder.com/300"} 
                          alt={product.name} 
                          className="w-full h-48 object-cover"
                        />
                        <Badge className="absolute top-2 right-2 bg-green-500">{product.category}</Badge>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-lg">{product.name}</CardTitle>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <p className="text-gray-300 text-sm line-clamp-2">{product.description}</p>
                        <p className="text-xl font-semibold text-primary mt-2">${product.price.toFixed(2)}</p>
                      </CardContent>
                      
                      <CardFooter className="pt-0 pb-4">
                        <Button 
                          className="w-full bg-primary/90 hover:bg-primary"
                          onClick={() => navigate(`/shop/product/${product.id}`)}
                        >
                          Book Service
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No services found.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;