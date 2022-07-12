import { useState } from "react";

function App() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchInfo, setSearchInfo] = useState({});

  const handleSearch = async (e) => {
    window.scroll({
      top: 0, 
      left: 0, 
      behavior: 'smooth'
    });
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
    window.location = 'https://iamrishan.github.io/seekrrr';
}

const nextPage = async (e) => {
  const endPoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=40&srsearch=${search}`;
  const response = await fetch(endPoint);
  const json = await response.json();
  setResults(json.query.search);
  setSearchInfo(json.query.searchinfo);
};
    return (
    <div className="App">
      <header>
        <h1 onClick={home}>Seek.rrr</h1>
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="search"
            id="search"
            placeholder="What are you seeking for?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        {totalresults ? (
          <p class="totalhits"> {numberWithCommas(totalresults)} results found!</p>
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
                Read more >
              </a>
            </div>
          );
        })}
      </div>
      {totalresults ? (<div className="pagination" onClick={nextPage}>Load more ></div>) : ("")}
    </div>
  );
}

export default App;
