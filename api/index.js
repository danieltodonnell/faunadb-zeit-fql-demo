const faunadb = require('faunadb')
const querystring = require('querystring')
const url = require('url')

const secret = process.env.FAUNADB_SECRET_KEY

const q = faunadb.query
const client = new faunadb.Client({ secret })

module.exports = async (req, res) => {
  try {
    const dbs = await client.query(
      q.Map( // iterate each item in result
        q.Paginate( // make paginatable
          q.Match( // query index
            q.Index('all_customers') // specify source
          )
        ), 
      (ref) => q.Get(ref)) // lookup each result by its reference
    )
    // ok
    res.status(200).json( dbs.data )
  }
  catch(e) {
    // something went wrong
    res.status(500).json({ error: e.message })
  }
}