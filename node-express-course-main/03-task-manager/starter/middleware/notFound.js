const notFound = (req, res) => res.status(404).send('the route does not exist');

module.exports = notFound;