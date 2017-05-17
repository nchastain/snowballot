import React from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import { getCurrentPage } from '.././utilities/generalUtils'
import { getSearchResults } from '.././utilities/sbUtils'

const PageList = (props) => {
  let { searchTerm, path, numPages, sbs } = props

  const getQuery = function () {
    return searchTerm !== '' ? `q=${searchTerm}` : ''
  }

  const getPages = function () {
    let pages = []
    for (let i = 1; i < numPages + 1; i++) {
      pages.push(
        <Link
          className={i === getCurrentPage(path) ? 'active-page' : ''}
          key={i}
          id={`page-${i}`}
          to={`/discover/page=${i}?${getQuery()}`}>{i}
        </Link>
      )
    }
    return pages
  }

  const buildPages = function () {
    const arrowClasses = (hidden) => { return {'page-arrow': true, 'hidden': hidden} }
    return (
      <span>
        <div id='search-results-message'>
          {searchTerm !== '' ? `${getSearchResults(searchTerm, sbs).length} snowballots found` : ''}
        </div>
        <div className='pagination'>
          <div id='search-results-icons'>
            <Link
              className={classnames(arrowClasses(getCurrentPage(path) === 1))}
              to={`/discover/page=${getCurrentPage(path) - 1}?q=${getQuery()}`}
            >
              &lsaquo;
            </Link>
            {getPages()}
            <Link
              className={classnames(arrowClasses(getCurrentPage(path) === numPages))}
              to={`/discover/page=${getCurrentPage(path) + 1}?q=${getQuery()}`}
            >
              &rsaquo;
            </Link>
          </div>
        </div>
      </span>
    )
  }
  return (
    <div id='page-list' className='discover-pages'>
      {numPages > 1 ? buildPages() : <div className='pagination' />}
    </div>
  )
}

export default PageList
