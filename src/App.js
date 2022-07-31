import { useState } from "react";
import {
  FaAngleRight,
  FaAngleDown,
  FaCog,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

function App() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchInfo, setSearchInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    document.getElementById("search").blur();
    if (search === "") return;
    const endPoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${search}`;
    const response = await fetch(endPoint);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    const json = await response.json();
    setResults(json.query.search);
    setSearchInfo(json.query.searchinfo);
  };

  const totalresults = searchInfo.totalhits;

  function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x)) x = x.replace(pattern, "$1,$2");
    return x;
  }

  function home(e) {
    e.preventDefault();
    window.location = "https://iamrishan.github.io/seekrrr";
  }

  function handleClear() {
    const searchBox = document.getElementById("search");
    searchBox.value = "";
    searchBox.focus();
    setSearch("");
  }

  const nextPage = async (e) => {
    setIsLoading(true);
    const endPoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=40&srsearch=${search}`;
    const response = await fetch(endPoint);
    const json = await response.json();
    setResults(json.query.search);
    setSearchInfo(json.query.searchinfo);
    setIsLoading(false);
  };

  return (
    <div className="App">
      <header>
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <div className="title" onClick={home}>
          <h1>
            Seek.r<sup>3</sup>
          </h1>
        </div>
        <form className="search-box" onSubmit={handleSearch}>
          <FaSearch className="searchIcon" size={20} color="#acacac" />
          <input
            type="search"
            id="search"
            placeholder="What are you seeking for?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search ? (
            <div onClick={handleClear} className="clearIcon">
              <FaTimes size={20} color="#4e54c8" />
            </div>
          ) : (
            ""
          )}
        </form>
        {totalresults ? (
          <p class="totalhits">
            {" "}
            {numberWithCommas(totalresults)} results found!
          </p>
        ) : (
          ""
        )}
      </header>
      <div className="results">
        {results.map((result, i) => {
          const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
          return (
            <div className="result" key={i}>
              <h3>{result.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: result.snippet }}></p>
              <a href={url} target="_blank" rel="noreferrer">
                Read more <FaAngleRight />
              </a>
            </div>
          );
        })}
      </div>
      {totalresults ? (
        <div className="pagination" onClick={nextPage}>
          Load more&nbsp;
          {isLoading ? <FaCog className="loaderIcon" /> : <FaAngleDown />}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
