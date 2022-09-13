import React, {useState} from 'react';
import {v4 as uuid} from 'uuid';

const Form = ({handleUserName, error, send}) => {
  return (
    <article className="lobby-wrapper">
      <div className="header">
        <h1>Choose your username</h1>
        <form className="username-form" onSubmit={(e) => send(e)}>
            <input type="text" className="username-input" onChange={(e) => handleUserName(e.target.value)}/>
            <div className="submit-btn-wrapper">
              <button className="submit-btn">Create A Game</button>
            </div>
        </form>
        {error && (
          <div className="error-wrapper">
            <p>Please enter a username.</p>
          </div>
        )}
      </div>
    </article>
  );
}

export default Form