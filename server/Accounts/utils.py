import secrets
import hashlib
from django.core.cache import cache

def generate_otp():
    """
    generating otp using secrets randbelow in the range 900000 100000
    and convert it into string using str method and return it
    """
    return str(secrets.randbelow(900000) + 100000)




OTP_EXPIRY = 300
def save_otp(email,otp):
    '''
        Saving Otp In Temporary Memory
    '''
    otp_hash = hashlib.sha256(otp.encode()).hexdigest()
    cache.set(
        f"otp {email}",
        otp_hash,
        timeout=OTP_EXPIRY
    )


def verify_otp(email,otp):
    '''
        Verify OTP
    '''
    stored_hashed = cache.get(f"otp {email}")
    if not stored_hashed:
        return False

    return hashlib.sha256(otp.encode()).hexdigest() == stored_hashed
