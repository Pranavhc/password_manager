import streamlit as st
import requests

api_url = "http://localhost:5000/api" # local development
# api_url = "https://password-manager-ojvm.onrender.com/api" # production

# Set page config and apply custom dark theme styling.
st.set_page_config(
    page_title="Password Manager",
    layout="centered",
    initial_sidebar_state="collapsed",
    page_icon="🔐",
)

st.title("🔥 Password Manager")
st.subheader("Login to access your secrets!")

email = st.text_input("Email", placeholder="Enter your email", key="email", max_chars=320)
password = st.text_input("Password", placeholder="Enter your password", type="password", key="password", max_chars=20, help="Password must be at least 8 characters long.")

with st.container():
    cols = st.columns([1, 0.01, 1])

    if not email or not password:
        st.warning("Please enter your email and password to continue.")
        st.stop()
    elif len(password) < 8:
        st.warning("Password must be at least 8 characters long.")
        st.stop()

    with cols[0]:
        if st.button("Login", key="login_button", type="primary", use_container_width=True):
            res = requests.post(f"{api_url}/auth/login", json={"email": email.strip(), "password": password.strip()})
            if res.status_code == 200:
                st.success("Login successful!")
                token = res.json().get("token")
                st.session_state["token"] = token
                st.switch_page("pages/my_passwords.py")
            else:
                st.error(res.json()['msg'])

    with cols[2]:
        if st.button("Register", key="register_button", type="secondary", use_container_width=True):
            res = requests.post(f"{api_url}/auth/register", json={"email": email.strip(), "password": password.strip()})
            if res.status_code == 201:
                st.success("Register successful!")
                token = res.json().get("token")
                st.session_state["token"] = token
                st.switch_page("pages/my_passwords.py")
            else:
                st.error(res.json()['msg'])

st.markdown("---")
st.markdown("🙏 Welcome to a very simple password manager!")
st.markdown("We expect you to save passwords that go with your email as the username you use to register and login here.")
st.markdown("It's entirely possible to use this app not only for passwords, but also for any other sensitive information you want to keep secret.")
st.markdown("💖 This app is built with Streamlit in Python, and uses MongoDB for data storage with Node.js doing the heavylifting in the backend!")