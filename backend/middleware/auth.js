import jwt from "jsonwebtoken";

// next allows us to have the function continue
export const verifyToken = async (req, res, next) => {
	try {
		let token = req.header("Authorization"); // grab the token from the frontend "Authorization" header

		if (!token) {
			return res.status(403).json({ error: "Access Denied" }); // token doesn't exist, not even sending it (.send() => send back the plain text "Access Denied")
		}

		if (!token.startsWith("Bearer ")) {
			return res.status(403).json({ error: "Access Denied" });
		} else {
			token = token.slice(7, token.length).trimLeft(); // remove "Bearer" from the token (trimLeft => remove whitespace before the token)
		}

		// If the JWT is verified successfully, the verified payload (typically containing user information) is attached to the request object as req.user
		// This allows the subsequent route handler to access and use the user information extracted from the JWT.
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		next();
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
