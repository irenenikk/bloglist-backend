const listHelper = require('../utils/list-helper')

const oneBlogList = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const threeBlogList = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f9',
    title: 'This is title yes',
    author: 'Person',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 4,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17g8',
    title: 'Good title',
    author: 'Person',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 2,
    __v: 0
  }
]

describe('total likes', () => {
  test('when list has one blog, totalLikes returns the amount of likes for that blog', () => {
    const result = listHelper.totalLikes(oneBlogList)
    expect(result).toBe(5)
  })

  test('when list is empty, totaLikes returns 0', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('totalLikes sums likes in list with several blogs', () => {
    const result = listHelper.totalLikes(threeBlogList)
    expect(result).toBe(11)
  })
})


describe('favorite blog', () => {

  test('with one blog in list, that blog is the favorite', () => {
    const fave = listHelper.favoriteBlog(oneBlogList)
    expect(fave).toEqual(oneBlogList[0])
  })

  test('with an empty list the favorite is undefined', () => {
    const fave = listHelper.favoriteBlog([])
    expect(fave).toBe(undefined)
  })

  test('with a list with several blogs favoriteBlog returns the blog with most likes', () => {
    const fave = listHelper.favoriteBlog(threeBlogList)
    expect(fave).toEqual(oneBlogList[0])
  })
})

describe('blog statistics', () => {

  test('mostBlogs returns gives the author with most blogs', () => {
    const fave = listHelper.mostBlogs(threeBlogList)
    expect(fave).toEqual({ author: 'Person', blogs: 2 })
  })

  test('when list only contains one blog, mostBlogs returns that blog', () => {
    const fave = listHelper.mostBlogs(oneBlogList)
    expect(fave).toEqual({ author: 'Edsger W. Dijkstra', blogs: 1 })
  })

  test('mostBlog returns undefined with an empty list', () => {
    const fave = listHelper.mostBlogs([])
    expect(fave).toEqual(undefined)
  })

  test('mostLikes return gives the author with most likes', () => {
    const popular = listHelper.mostLikes(threeBlogList)
    expect(popular).toEqual({ author: 'Person', likes: 6 })
  })

  test('when list only contains one blog, mostLIkes returns that blog', () => {
    const popular = listHelper.mostLikes(oneBlogList)
    expect(popular).toEqual({ author: 'Edsger W. Dijkstra', likes: 5 })
  })

  test('mostLikes returns undefined with an empty list', () => {
    const popular = listHelper.mostLikes([])
    expect(popular).toEqual(undefined)
  })

})

