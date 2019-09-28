import React from "react";

const Header = () => (
  <header className="App-header">
    <ul>
      What you can make with D3:
      <li>
        <a
          className="App-link"
          href="https://familytree.netlify.com/#/main"
          target="_blank"
          rel="noopener noreferrer"
        >
          'Bloom' Family Tree
        </a>
      </li>
      <li>
        <a
          className="App-link"
          href="https://monicawoj.github.io/EU_Trust/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Europe through Social Connections
        </a>
      </li>
      <li>
        <a
          className="App-link"
          href="https://monicawoj.github.io/SpicesMadeSimple/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Spices made Simple
        </a>
      </li>
      <li>
        <a
          className="App-link"
          href="https://d3js.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          And MANY, MANY MORE COOL THINGS
        </a>
      </li>
    </ul>
  </header>
);

export default Header;
