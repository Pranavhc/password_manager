import streamlit as st
import requests

api_url = "http://localhost:5000/api"

st.set_page_config(
    page_title="All Password",
    layout="centered",
    initial_sidebar_state="collapsed",
    page_icon="📖",  
)

if 'token' not in st.session_state:
    st.warning("Please log in to access this page.")
    st.stop()

st.title("All Passwords")
st.markdown("Add New Password")
with st.container():
        col1, col2, col3 = st.columns([4, 4, 1])

        with col1:
            new_title = st.text_input(label="Title", value="", label_visibility="collapsed", placeholder="Enter title", key="new_title", max_chars=100)

        with col2:
            new_password = st.text_input(label="Password", value="", label_visibility="collapsed", type="password", placeholder="Enter password", key="new_password", max_chars=100)

        with col3:
            if st.button("➕", use_container_width=True):
                res = requests.post(f"{api_url}/passwords", headers={"Authorization": f"Bearer {st.session_state['token']}"}, json={"title": new_title, "password": new_password})
                if res.status_code == 201:
                    st.switch_page("pages/my_passwords.py")
                else:
                    st.error(res.json()['msg'])

def render_password_row(item):
    col1, col2, col3, col4 = st.columns([4, 4, 1, 1])

    with col1:
        # st.markdown("**Title**")
        new_title = st.text_input(
            label="Title", value=item["title"],
            label_visibility="collapsed", key=f"title_{item['_id']}"
        )

    with col2:
        # st.markdown("**Password**")
        new_password = st.text_input(
            label="Password", value=item["password"],
            label_visibility="collapsed", key=f"pass_{item['_id']}", type="password"
        )

    # delete button
    with col3:
        # st.markdown("**&nbsp;**", unsafe_allow_html=True)
        if st.button("🗑️", key=f"delete_{item['_id']}", use_container_width=True):
            res = requests.delete(f"{api_url}/passwords/{item['_id']}", headers={"Authorization": f"Bearer {st.session_state['token']}"})
            if res.status_code == 200:
                st.switch_page("pages/my_passwords.py") # refresh the page
            else:
                st.error(res.json()['msg'])

    # update button
    with col4:
        # st.markdown("**&nbsp;**", unsafe_allow_html=True)
        if new_title != item["title"] or new_password != item["password"]:
            if st.button("✍️", key=f"update_{item['_id']}", use_container_width=True):
                res = requests.patch(f"{api_url}/passwords/{item['_id']}", headers={"Authorization": f"Bearer {st.session_state['token']}"}, json={"title": new_title, "password": new_password})
                if res.status_code == 201:
                    st.switch_page("pages/my_passwords.py") # refresh the page
                else:
                    st.error(res.json()['msg'])
    st.markdown("---")

res = requests.get(f"{api_url}/passwords", headers={"Authorization": f"Bearer {st.session_state['token']}"})

if res.status_code == 200:
    st.success(f"Total Passwords: {res.json()['count']}")
    st.markdown("---")
    col1, col2, col3, col4 = st.columns([4, 4, 1, 1])

    with col1:
        st.markdown("**Title**")

    with col2:
        st.markdown("**Password**")

    passwords:dict = res.json()['passwords']
    for password in passwords:
        render_password_row(password)
    
else:
    st.error("Failed to retrieve passwords.")
    st.error(res.json()['msg'])

# st.markdown("**&nbsp;**", unsafe_allow_html=True)
if st.button("Logout", use_container_width=True, type="primary"):
    st.session_state.clear()
    st.switch_page("main.py")