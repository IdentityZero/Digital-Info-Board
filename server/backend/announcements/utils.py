from datetime import datetime, timedelta


def check_valid_display_duration(
    start_date: datetime, end_date: datetime, duration: timedelta
) -> bool:
    """
    Checks if the total duration is less than end date - start date
    """
    return end_date - start_date < duration
