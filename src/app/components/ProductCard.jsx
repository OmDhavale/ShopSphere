const ProductCard = ({ image, name, category, description, price }) => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-4 relative">
        {/* Discount Tag */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "0px",
            width: "150px",
            height: "60px",
            backgroundColor: "red",
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
            borderRadius: "0px",
            display: "flex",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            padding: "10px",
            justifyContent: "center",
            alignItems: "center",
            clipPath: "polygon(0 0, 100% 0, 80% 50%, 100% 100%, 0 100%)",
          }}
        >
          {Math.ceil(((price * 1.2 - price) / (price * 1.2)) * 100)}% off !
        </div>

        <img
          src={image}
          alt={name}
          className="w-full h-44 object-cover rounded-2xl"
        />
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-700">{name}</h2>
          <p className="text-gray-500">{category}</p>
          <p className="text-gray-700">{description}</p>
          <p className="text-red-600 line-through">
            ₹{(price * 1.2).toFixed(2)}
          </p>
          {/* Original discount percentage text */}
          {/* <p className="text-yellow-600">{Math.ceil((price*1.2 - price)/(price*1.2)*100)}% off !</p> */}
          <p className="text-green-600 font-bold text-2xl">₹{price}</p>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;