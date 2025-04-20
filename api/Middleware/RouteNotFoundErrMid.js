const notFoundMiddleware = (req, res) => res.status(404).send("Route Doesn't Exist!");

export default notFoundMiddleware;