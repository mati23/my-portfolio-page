import styles from "./styles.module.css"

function NavbarComponent() {

	return (
		<nav className={styles.navbar}>
			<div className={styles.container}>
				<a href="https://flowbite.com/">
					<img src="https://flowbite.com/docs/images/logo.svg" alt="Flowbite Logo" />
					<span className={styles.logoName}>Mateus Arruda</span>
				</a>
				<button data-collapse-toggle="navbar-default" type="button" className={styles.button} aria-controls="navbar-default" aria-expanded="false">
					<span className="sr-only">Open main menu</span>
					<svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
				</button>
				<div className={styles.navbarDefault} id="navbar-default">
					<ul>
						<li><a href="/" aria-current="page">Home</a></li>
						<li><a href="/myfavourites">Favorites</a></li>
						<li><a href="/bookreviews">Book Reviews</a></li>
						<li><a href="/myportfolio">Portfolio</a></li>
					</ul>
				</div>
			</div>
		</nav>

	)
}

export default NavbarComponent
