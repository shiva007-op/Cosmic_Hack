import requests
from datetime import date, timedelta
from calendar import monthrange
from app.core.config import NASA_API_KEY

NASA_FEED_URL = "https://api.nasa.gov/neo/rest/v1/feed"


# =========================
# Internal helper
# =========================
def _fetch_feed(start_date: str, end_date: str):
    """
    Low-level NASA NEO feed fetcher
    """
    params = {
        "start_date": start_date,
        "end_date": end_date,
        "api_key": NASA_API_KEY,
    }

    response = requests.get(NASA_FEED_URL, params=params, timeout=15)
    response.raise_for_status()
    return response.json()


# =========================
# TODAY
# =========================
def fetch_today_asteroids():
    """
    Fetch today's Near-Earth Objects
    """
    today = date.today().isoformat()
    return _fetch_feed(today, today)


# =========================
# HISTORY (PAST N DAYS)
# =========================
def fetch_past_asteroids(days: int):
    """
    Fetch past N days of NEO data
    NASA recommends <= 7 days per request
    """
    end_date = date.today()
    start_date = end_date - timedelta(days=days)

    return _fetch_feed(
        start_date.isoformat(),
        end_date.isoformat(),
    )


# =========================
# CALENDAR (FULL MONTH)
# =========================
def fetch_month_asteroids(year: int, month: int):
    """
    Fetch full month NEO data.
    NASA API allows max 7 days per request,
    so we chunk the month into 7-day windows.
    """
    results = {"near_earth_objects": {}}

    days_in_month = monthrange(year, month)[1]
    current_day = date(year, month, 1)

    while current_day.month == month:
        chunk_end = min(
            current_day + timedelta(days=6),
            date(year, month, days_in_month),
        )

        chunk_data = _fetch_feed(
            current_day.isoformat(),
            chunk_end.isoformat(),
        )

        for day, neos in chunk_data.get("near_earth_objects", {}).items():
            results["near_earth_objects"][day] = neos

        current_day = chunk_end + timedelta(days=1)

    return results
