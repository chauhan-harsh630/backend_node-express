const fakeuser = [
    { id: 1, name: "Harsh", role: "Full Stuck Dveloper" },
    { id: 2, name: "Akshay", role: "Frontend Dveloper" },
    { id: 3, name: "Riddhima", role: "UI/UX Desinger" },
    { id: 4, name: "Prerna", role: "UI/UX Desinger" },
    { id: 5, name: "Gauri", role: "Frontend Dveloper" },
    { id: 6, name: "Tushar", role: "Backend Dveloper" },

]
const fakeCallDB = () => {
    return new Promise((res) => {
        setTimeout(() => res(fakeuser), 500);
    });
}
export const getUser = async (req, res, next) => {
    try {
        const users = await fakeCallDB();
        const user = users.find((u) => u.id === Number(req.params.id));

        if (!user) {
            return res.status(404).json({ message: " User not found " });
        }
        else {
            res.status(200).json({
                success: true,
                data: user,
            });
        }
        console.log("Found User: ", user);
    } catch (error) {
        next(error);
    }
}