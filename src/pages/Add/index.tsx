import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  description?: string;
  img?: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/products", {
          cache: "no-cache",
        });
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !price || !description || !img) {
      setError('All fields are required');
      setSuccess('');
      return;
    }

    const newProduct = { title, price: parseFloat(price as string), description, img };

    try {
      const res = await fetch("http://localhost:8000/products", {
        method: "POST",
        body: JSON.stringify(newProduct),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error('Failed to add product');
      }

      const fetchRes = await fetch("http://localhost:8000/products", {
        cache: "no-cache",
      });

      if (!fetchRes.ok) {
        throw new Error('Failed to fetch updated products');
      }

      const data: Product[] = await fetchRes.json();
      setProducts(data);
      setSuccess('Product added successfully!');
      setError('');
      setTitle('');
      setPrice('');
      setDescription('');
      setImg('');
    } catch (error) {
      console.error("Fetch error:", error);
      setError('Failed to add product');
      setSuccess('');
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error('Failed to delete product');
      }

      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
      setSuccess('Product deleted successfully!');
      setError('');
    } catch (error) {
      console.error("Fetch error:", error);
      setError('Failed to delete product');
      setSuccess('');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Product Belissimo</h1>
      <form onSubmit={addProduct} style={{ width: '100%', maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: '15px', width: '48%', border: '1px solid #007BFF', borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'border-color 0.3s ease', marginRight: "40px" }}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ padding: '15px', width: '48%', border: '1px solid #007BFF', borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'border-color 0.3s ease' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: '15px', width: '48%', border: '1px solid #007BFF', borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'border-color 0.3s ease', marginRight: "40px" }}
          />
          <input
            type="text"
            name="img"
            placeholder="Image URL"
            value={img}
            onChange={(e) => setImg(e.target.value)}
            style={{ padding: '15px', width: '48%', border: '1px solid #007BFF', borderRadius: '8px', fontSize: '16px', outline: 'none', transition: 'border-color 0.3s ease' }}
          />
        </div>
        <button type="submit" style={{ padding: '15px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.3s ease', width: '100%' }}>
          Add
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
      </form>
      <div style={{ marginTop: '30px', width: '100%', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {products.map((i) => (
          <div key={i.id} style={{ width: '300px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', backgroundColor: '#fff', marginBottom: '20px' }}>
            {i.img && (
              <img src={i.img} alt={i.title} style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '10px' }} />
            )}
            <h2 style={{ marginBottom: '10px', color: '#333' }}>{i.title}</h2>
            {i.description && <p style={{ marginBottom: '10px' }}>Description: {i.description}</p>}
            <p style={{ marginBottom: '10px' }}>Price: ${i.price}</p>
            {/* <button
              onClick={() => deleteProduct(i.id)}
              style={{ padding: '10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.3s ease', width: '100%' }}
            >
              Delete
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
