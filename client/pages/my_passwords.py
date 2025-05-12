import streamlit as st
import requests

from datetime import datetime, timezone
from dateutil import parser
import humanize

from zxcvbn import zxcvbn

import secrets
import string

# api_url = "http://localhost:5000/api" # local development
api_url = "https://password-manager-ojvm.onrender.com/api" # production

st.set_page_config(
    page_title="All Password",
    layout="centered",
    initial_sidebar_state="collapsed",
    page_icon="📖",  
)

if 'token' not in st.session_state:
    st.warning("Please log in to access this page.")
    st.stop()

def analyze_password_strength(password):
    result = zxcvbn(password)

    score = result['score']  # 0 to 4
    feedback = result['feedback']
    suggestions = feedback.get('suggestions', [])
    warning = feedback.get('warning', '')

    return {
        'score': score,
        'suggestions': suggestions,
        'warning': warning
    }

def generate_password(length=16):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(characters) for _ in range(length))

# Trigger password generation before rendering input
if "generate_new_password" not in st.session_state:
    st.session_state["generate_new_password"] = False

if "new_password" not in st.session_state:
    st.session_state["new_password"] = ""

if st.session_state.generate_new_password:
    st.session_state["new_password"] = generate_password()
    st.session_state["generate_new_password"] = False  # reset
    st.rerun()

st.title("All Passwords")
st.markdown("**Add New Password**")
with st.container():
        col1, col2, col3, col4 = st.columns([4, 4, 1, 1])

        with col1:
            new_title = st.text_input(label="Title", value="", label_visibility="collapsed", placeholder="Enter title", key="new_title", max_chars=100)

        with col2:
            new_password = st.text_input(label="Password", label_visibility="collapsed", key='new_password', type="password", placeholder="Enter password", max_chars=100)

        with col3:
            if st.button("➕", use_container_width=True, help="add new password"):
                res = requests.post(f"{api_url}/passwords", headers={"Authorization": f"Bearer {st.session_state['token']}"}, json={"title": new_title, "password": st.session_state.new_password})
                if res.status_code == 201:
                    st.switch_page("pages/my_passwords.py")
                else:
                    st.error(res.json()['msg'])

        with col4:
            if st.button("🧬", use_container_width=True, help="generate a strong password"):
                st.session_state["generate_new_password"] = True
                st.rerun()

        if new_password:
            with st.container():
                st.markdown("**Password Strength Analysis**")
                strength = analyze_password_strength(new_password)
                st.markdown(f"**Score:** {strength['score']}/4", unsafe_allow_html=True)
                if strength['suggestions']:
                    st.markdown("**Suggestions:**")
                    for suggestion in strength['suggestions']:
                        st.markdown(f"- {suggestion}", unsafe_allow_html=True)
                else :
                    st.markdown("**Suggestions:** No suggestions available.", unsafe_allow_html=True)
                warning = analyze_password_strength(new_password)['warning']
                if warning: st.markdown(f"**Analysis:** {warning}", unsafe_allow_html=True)
                else: st.markdown("**Analysis:** No analysis available.", unsafe_allow_html=True)
                st.markdown("---")

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
        if st.button("🗑️", key=f"delete_{item['_id']}", use_container_width=True, help="Delete password"):
            res = requests.delete(f"{api_url}/passwords/{item['_id']}", headers={"Authorization": f"Bearer {st.session_state['token']}"})
            if res.status_code == 200:
                st.switch_page("pages/my_passwords.py") # refresh the page
            else:
                st.error(res.json()['msg'])

    # update button
    with col4:
        # st.markdown("**&nbsp;**", unsafe_allow_html=True)
        if new_title != item["title"] or new_password != item["password"]:
            if st.button("✍️", key=f"update_{item['_id']}", use_container_width=True, help="Update password"):
                res = requests.patch(f"{api_url}/passwords/{item['_id']}", headers={"Authorization": f"Bearer {st.session_state['token']}"}, json={"title": new_title, "password": new_password})
                if res.status_code == 201:
                    st.switch_page("pages/my_passwords.py") # refresh the page
                else:
                    st.error(res.json()['msg'])
    

    now = datetime.now(timezone.utc)
    created_at = parser.isoparse(item['createdAt'])
    updated_at = parser.isoparse(item['updatedAt'])
    relative_time_c = humanize.naturaltime(now - created_at)
    relative_time_u = humanize.naturaltime(now - updated_at)

    col1, col2 = st.columns([1, 1.5])
    with col1: st.markdown(f"**Created:** {relative_time_c}")
    with col2: st.markdown(f"**Updated:** {relative_time_u}")

    st.markdown("---")

sort_option = st.radio(
    "Sort passwords by:",
    options=["Newest first", "Oldest first"],
    horizontal=True
)

sort_param = True if sort_option == "Newest first" else False

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
    passwords.sort(key=lambda x: x['createdAt'], reverse=sort_param)
    for password in passwords:
        render_password_row(password)
    
else:
    st.error("Failed to retrieve passwords.")
    st.error(res.json()['msg'])

# st.markdown("**&nbsp;**", unsafe_allow_html=True)
if st.button("Logout", use_container_width=True, type="primary"):
    st.session_state.clear()
    st.switch_page("main.py")