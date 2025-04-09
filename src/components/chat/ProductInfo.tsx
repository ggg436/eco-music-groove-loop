
interface ProductInfoProps {
  product: MarketplaceItem | null;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  if (!product) return null;
  
  // Get fallback image if no product images available
  const imageUrl = product.image_url || 
                  (product.images && product.images.length > 0 ? product.images[0] : 
                  'https://images.unsplash.com/photo-1560343090-f0409e92791a');
  
  return (
    <div className="p-3 bg-muted/50 border-b flex items-center">
      <div className="h-10 w-10 rounded overflow-hidden mr-2">
        <img 
          src={imageUrl} 
          alt={product.title} 
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <p className="text-sm font-medium truncate max-w-[250px]">{product.title}</p>
        {product.price !== null && (
          <p className="text-xs">${product.price}</p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
