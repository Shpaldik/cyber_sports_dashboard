<template>
    <header class="header">
        <div class="header_items">
            <div class="header_left">
                <div class="logo">
                    <img src="../assets/images/logo.svg" alt="logo" width="50">
                    <h1 class="title">CYBERSPORT</h1>
                </div>

                <div class="nav-links">
                    <p>Главная</p>
                    <p>Dota 2</p>
                    <p>CS 2</p>
                </div>
            </div>

            <div class="header_right">
                <p>©CYBERSPORT 2025</p>
            </div>
        </div>
    </header>
</template>


<style scoped>
.header {
    width: 100%;
    height: 80px;
    background-color: #00000038;
    display: flex;
    justify-content: center;
    align-items: center;
}

.header_items {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 90%; 
    padding: 10px 10%;
}

.header_left {
    display: flex;
    align-items: center;
    gap: 60px;
    flex-wrap: wrap;
}

.header_right {
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: flex-end;
}

.header_right button {
    padding: 10px;
    border-radius: 5px;
    font-weight: 100;
    transform: scale(1);
    transition: 0.2s;
}

.header_right button:hover {
    background: var(--btn--hover-color);
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
}

.register {
    background: var(--btn-color);
}

.login {
    background: none;
}

.nav-links {
    display: flex;
    gap: 40px;
    justify-content: center; 
}


.burger_menu {
    display: none;
}


@media (max-width: 900px) {
    .header_items {
        display: flex;
        gap: 15px;
    }

    .nav-links {
        display: none;
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
    }

    .title {
        display: none;
    }

    .menu-visible .nav-links {
        display: flex;
    }

    .menu-visible .header_right {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
}
</style>
