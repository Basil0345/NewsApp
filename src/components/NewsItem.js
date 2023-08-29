import React, { Component } from 'react'

export class NewsItem extends Component {

    render() {
        let { title, description, imageUrl, newsUrl, author, date, source } = this.props;
        return (
            <div className="card my-3">
                <div className='d-flex justify-content-start position-absolute end-0'>
                    <span className="badge rounded-pill bg-danger">
                        {source}
                    </span>
                </div>
                <img src={imageUrl ? imageUrl : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0_wdtTvl7Ws18YV6FzBx-_aqkytKTV5AIIw&usqp=CAU"} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{title}...</h5>
                    <p className="card-text">{description}...</p>
                    <p className="card-text"><small className="text-muted">By {author ? author : "Unkown"} on {new Date(date).toUTCString()}</small></p>
                    <a href={newsUrl} target='_blank' rel="noreferrer" className="btn btn-sm btn-dark">Read more</a>
                </div>
            </div >
        )
    }
}

export default NewsItem
