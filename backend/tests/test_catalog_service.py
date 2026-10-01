from app.services.catalog_service import make_slug


def test_make_slug_normalizes_name() -> None:
    assert make_slug("String Hoppers & Sothi") == "string-hoppers-sothi"


def test_make_slug_trims_separators() -> None:
    assert make_slug("  Masala Dosa  ") == "masala-dosa"
