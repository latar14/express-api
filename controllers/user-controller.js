const UserController = {
    register: async (req, res) => {

        const { email, password, name} = req.body;

        if (!email || !password || !name) {
            return res.status(400).json('Все поля обязательны')
        }
        res.send('register')
    },
    login: async (req, res) => {
        res.send('login')
    },
    getUserById: async (req, res) => {
        res.send('getUserById')
    },
    updateUser: async (req, res) => {
        res.send('updateUSer')
    },
    currentUser: async (req, res) => {
        res.send('current')
    },
};



module.exports = UserController;