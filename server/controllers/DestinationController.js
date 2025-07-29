const pool = require('../db'); // Assumes you’ve setup pg pool in db/index.js

class DestinationController {
    // 🔍 Get all destinations for current user
    static async getUserDestinations(req, res) {
        const userId = req.user.id; // assuming user is attached by middleware
        try {
            const result = await pool.query(
                'SELECT * FROM destinations WHERE user_id = $1 ORDER BY created_at DESC',
                [userId]
            );
            res.status(200).json(result.rows);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch destinations' });
        }
    }

    // ➕ Create new destination
    static async createDestination(req, res) {
        const { name, location, risk_level } = req.body;
        const userId = req.user.id;

        try {
            const result = await pool.query(
                `INSERT INTO destinations (user_id, name, location, risk_level)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
                [userId, name, location, risk_level || 'low']
            );
            res.status(201).json(result.rows[0]);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create destination' });
        }
    }

    // 📄 Get specific destination by ID
    static async getDestination(req, res) {
        const { id } = req.params;
        const userId = req.user.id;

        try {
            const result = await pool.query(
                'SELECT * FROM destinations WHERE id = $1 AND user_id = $2',
                [id, userId]
            );
            if (result.rows.length === 0)
                return res.status(404).json({ error: 'Destination not found' });

            res.status(200).json(result.rows[0]);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch destination' });
        }
    }

    // 🛠️ Update destination
    static async updateDestination(req, res) {
        const { id } = req.params;
        const userId = req.user.id;
        const { name, location, risk_level } = req.body;

        try {
            const result = await pool.query(
                `UPDATE destinations
         SET name = $1, location = $2, risk_level = $3
         WHERE id = $4 AND user_id = $5
         RETURNING *`,
                [name, location, risk_level, id, userId]
            );

            if (result.rows.length === 0)
                return res.status(404).json({ error: 'Destination not found or not yours' });

            res.status(200).json(result.rows[0]);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update destination' });
        }
    }

    // ❌ Delete destination
    static async deleteDestination(req, res) {
        const { id } = req.params;
        const userId = req.user.id;

        try {
            const result = await pool.query(
                'DELETE FROM destinations WHERE id = $1 AND user_id = $2 RETURNING *',
                [id, userId]
            );

            if (result.rows.length === 0)
                return res.status(404).json({ error: 'Destination not found or not yours' });

            res.status(200).json({ message: 'Destination deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete destination' });
        }
    }

    // 🕒 Update last checked timestamp
    static async updateLastChecked(req, res) {
        const { id } = req.params;
        const userId = req.user.id;

        try {
            const result = await pool.query(
                `UPDATE destinations
         SET last_checked = NOW()
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
                [id, userId]
            );

            if (result.rows.length === 0)
                return res.status(404).json({ error: 'Destination not found or not yours' });

            res.status(200).json(result.rows[0]);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update last checked timestamp' });
        }
    }

    // 🔍 Search destinations by location
    static async searchDestinations(req, res) {
        const { location } = req.query;
        const userId = req.user.id;

        try {
            const result = await pool.query(
                `SELECT * FROM destinations
         WHERE user_id = $1 AND location ILIKE $2`,
                [userId, `%${location}%`]
            );
            res.status(200).json(result.rows);
        } catch (err) {
            res.status(500).json({ error: 'Search failed' });
        }
    }

    // 🚦 Get destinations by risk level
    static async getDestinationsByRisk(req, res) {
        const { level } = req.params;
        const userId = req.user.id;

        try {
            const result = await pool.query(
                `SELECT * FROM destinations
         WHERE user_id = $1 AND risk_level = $2`,
                [userId, level]
            );
            res.status(200).json(result.rows);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch by risk level' });
        }
    }
}

module.exports = DestinationController;
