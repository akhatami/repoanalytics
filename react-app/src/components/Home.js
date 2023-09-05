import RepositoryList from "./RepositoryList";
import ResponsiveAppBar from "./ResponsiveAppBar";

const Home = () => {
    return (
        <>
        <ResponsiveAppBar/>
            <h1>Repositories</h1>
            <div>
                <RepositoryList />
            </div>
        </>
    );
}

export default Home;
