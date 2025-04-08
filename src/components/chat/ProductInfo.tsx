
interface ProductInfoProps {
  product: MarketplaceItem | null;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  if (!product) return null;
  
  return (
    <div className="p-3 bg-muted/50 border-b flex items-center">
      <div className="h-10 w-10 rounded overflow-hidden mr-2">
        <img 
          src={product.image_url || product.images?.[0] || 'https://images.unsplash.com/photo-1560343090-f0409e92791a'} 
          alt={product.title} 
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <p className="text-sm font-medium">{product.title}</p>
        {product.price !== null && (
          <p className="text-xs">${product.price}</p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
