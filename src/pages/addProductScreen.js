import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import withContext  from "../withContext";

const initState = {
  name: "",
  price: "",
  stock: "",
  shortDesc: "",
  description: ""
};

const AddProductScreen = ({ context }) => {
  const [state, setState] = useState(initState);
  const [flash, setFlash] = useState(null);
  const navigate = useNavigate();

  const save = async (e) => {
    e.preventDefault();
    const { name, price, stock, shortDesc, description } = state;

    if (name && price) {
      const id = Math.random().toString(36).substring(2) + Date.now().toString(36);

      await axios.post(
        'http://localhost:3001/products',
        { id, name, price, stock, shortDesc, description },
      );

      context.addProduct(
        {
          name,
          price,
          shortDesc,
          description,
          stock: stock || 0
        },
        () => setState(initState)
      );

      setFlash({ status: 'is-success', msg: 'Product created successfully' });
    } else {
      setFlash({ status: 'is-danger', msg: 'Please enter name and price' });
    }
  };

  const handleChange = e => setState({ ...state, [e.target.name]: e.target.value });

  const { name, price, stock, shortDesc, description } = state;
  const { user } = context;

  if (!(user && user.accessLevel < 1)) {
    navigate("/");
  }

  return (
    <>
      <div className="hero is-primary ">
        <div className="hero-body container">
          <h4 className="title">Add Product</h4>
        </div>
      </div>
      <br />
      <br />
      <form onSubmit={save}>
        <div className="columns is-mobile is-centered">
          <div className="column is-one-third">
            <div className="field">
              <label className="label">Product Name: </label>
              <input
                className="input"
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label className="label">Price: </label>
              <input
                className="input"
                type="number"
                name="price"
                value={price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label className="label">Available in Stock: </label>
              <input
                className="input"
                type="number"
                name="stock"
                value={stock}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label className="label">Short Description: </label>
              <input
                className="input"
                type="text"
                name="shortDesc"
                value={shortDesc}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label className="label">Description: </label>
              <textarea
                className="textarea"
                type="text"
                rows="2"
                style={{ resize: "none" }}
                name="description"
                value={description}
                onChange={handleChange}
              />
            </div>
            {flash && (
              <div className={`notification ${flash.status}`}>
                {flash.msg}
              </div>
            )}
            <div className="field is-clearfix">
              <button
                className="button is-primary is-outlined is-pulled-right"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default withContext(AddProductScreen);
