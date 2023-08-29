import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

export class News extends Component {

    static defaultProps = {
        country: "in",
        pageSize: 5,
        category: "general",
    }

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }

    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    constructor(props) {
        super(props)
        this.state = {
            articles: [],
            loading: true,
            page: 1,
            totalResults: 0,
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - N4News `
    }



    async updateNews() {
        try {
            this.props.setProgress(10);
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
            let data = await fetch(url); //response object
            this.props.setProgress(30);
            let parsedData = await data.json(); //parsed data
            this.props.setProgress(70);
            if (!data.ok) {
                throw new Error(`HTTP error! status: ${data.status}`);
            }
            this.setState({
                articles: parsedData.articles,
                totalResults: parsedData.totalResults,
                loading: false
            })
            this.props.setProgress(100);

        } catch (error) {
            console.log(error);
        }
    }

    async componentDidMount() {
        this.updateNews()
    }

    fetchMoreData = async () => {
        try {
            const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
            let data = await fetch(url);
            let parsedData = await data.json()
            if (!data.ok) {
                throw new Error(`HTTP error! status: ${data.status}`);
            }
            this.setState({
                articles: this.state.articles.concat(parsedData.articles),
                totalResults: parsedData.totalResults,
                page: this.state.page + 1,
            })
        } catch (error) {
            console.log(error);
        }
    };


    render() {
        return (
            <>
                <h1 className='text-center my-4'> News - Top {this.capitalizeFirstLetter(this.props.category)} Headlines </h1>
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                    loader={<Spinner />}
                >
                    <div className="container">
                        {this.state.loading && <Spinner />}
                        < div className="row" >
                            {
                                this.state.articles.map((element) => {
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
}

export default News
