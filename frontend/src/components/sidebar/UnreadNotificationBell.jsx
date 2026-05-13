function UnreadNotificationBell({ mobile = false }) {
    return (
        <span
            style={{
                position: mobile ? 'absolute' : 'static',
                top: mobile ? 3 : 'auto',
                right: mobile ? 4 : 'auto',
                width: mobile ? 18 : 20,
                height: mobile ? 18 : 20,
                borderRadius: '50%',
                background: '#ed4956',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: mobile ? 9 : 10,
                lineHeight: 1,
                boxShadow: '0 0 0 2px #000',
            }}
        >
            !
        </span>
    );
}

export default UnreadNotificationBell;
