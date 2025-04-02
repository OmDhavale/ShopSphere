const ProductCard = ({ image, name, category, description, price }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden p-4">
      <img src={image} alt={name} className="w-full h-44 object-cover rounded-2xl" />
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-700">{name}</h2>
        <p className="text-gray-500">{category}</p>
        <p className="text-gray-700">{description}</p>
        <p className="text-green-600 font-bold">₹{price}</p>
      </div>
    </div>
  );
};
export default ProductCard;