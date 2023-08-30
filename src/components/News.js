import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);


    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }


    const updateNews = async () => {
        try {
            props.setProgress(10);
            let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
            let data = await fetch(url); //response object
            props.setProgress(30);
            let parsedData = await data.json(); //parsed data
            props.setProgress(70);
            if (!data.ok) {
                throw new Error(`HTTP error! status: ${data.status}`);
            }
            setArticles(parsedData.articles);
            setTotalResults(parsedData.totalResults)
            setLoading(false);
            props.setProgress(100);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - N4News `
        updateNews();
        //eslint-disable-next-line
    }, [])

    const fetchMoreData = async () => {
        try {
            const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page + 1}&pageSize=${props.pageSize}`;
            let data = await fetch(url);
            let parsedData = await data.json()
            if (!data.ok) {
                throw new Error(`HTTP error! status: ${data.status}`);
            }
            setArticles(articles.concat(parsedData.articles));
            setTotalResults(parsedData.totalResults);
            setPage(page + 1);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            <h1 className='text-center' style={{ marginTop: "90px" }}> News - Top {capitalizeFirstLetter(props.category)} Headlines </h1>
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={<Spinner />}
            >
                <div className="container">
                    {loading && <Spinner />}
                    < div className="row" >
                        {
                            articles.map((element) => {
                                return (<div className="col-md-4" key={element.url}>
                                    <NewsItem title={element.title ? element.title.slice(0, 45) : ""} description={element.description ? element.description.slice(0, 88) : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                </div>)
                            })
                        }
                    </div >
                </div>
            </InfiniteScroll>
        </>
    )

}

News.defaultProps = {
    country: "in",
    pageSize: 5,
    category: "general",
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News
