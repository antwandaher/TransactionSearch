import './TransactionSearch.css';
import React, { useState } from 'react';

function TransactionSearch(props) {
    const [transID, setTransId] = useState('');
    const [products, setProducts] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isError, setError] = useState(false);
    const today = props.today;

    function handleSubmit() {
      const datestring = today.replace(' ', '');
      var date = new Date(datestring)
      var datestamp = date.getTime();
      fetch(`http://localhost:5000/eligiblereturns?transactionID=${transID}&tdStamp=${datestamp}`).then(res => {
        res.json().then(prods => {
            if (prods.successful === true) {
                setError(false);
                console.log(prods.data);
                setProducts(prods.data);
            } else {
                setError(true)
                setErrorMessage(prods.data);
            }
        })
      })
    }
  
    return (
      <div className="Container">
        <div className="Form">
            <div className="SearchBar">
                <div className="SearchBox">
                    <input 
                        className="SearchBox-Input"
                        onChange={(x) => setTransId(x.target.value)}
                        type="text"
                        placeholder="Transaction ID"
                    />
                    <button className='SearchBox-Button'
                        onClick={() => handleSubmit()}
                    >
                    <img
                        style={{height: '100%'}}
                        src="search.svg"
                        alt='search'
                    />
                    </button>  
                </div>
            </div>
        </div>
        <div className='DisplayResult' >
            {isError ? (
                <p style={{color: 'red'}}>
                    {errorMessage}
                </p>
            ) :
            products && products.length > 0 ?
            (
                <>
                    <h1 className='ProductCard-Title'>Returnable Products</h1>
                    <div className='ProductContainer'>
                        {products.map(x => (
                            <div className='ProductCard' key={x.id}>
                                <h1 className='ProductCard-Title'>
                                    {x.company}
                                </h1>
                                <p>
                                    ID: {x.id}
                                </p>
                            </div>
                        ))
                        }
                    </div>
                </>
            ) : products && products.length === 0 ? (
                <p>
                    No purchases from this transaction are eligible for return!
                </p>  
            ) : (
                <p>
                    Search by transaction ID to find purchase items that are eligible for returns.
                </p>
            )}
        </div>
      </div>
    )
  }

export default TransactionSearch;