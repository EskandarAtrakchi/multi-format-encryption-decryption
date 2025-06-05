function setCookie(name, value, minutes)
{
    const date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000)); //set a timer for 3mins
    const expires = `expires=${date.toUTCString}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`
}

setCookie("sessionCookie", "userSessionValue", 3);

function getCookie(name)
{
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if(parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

setInterval(() => {
    if (!getCookie("sessionCookie")) {
        window.location.reload();
    }
}, 5000);
