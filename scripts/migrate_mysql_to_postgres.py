#!/usr/bin/env python3
"""
Migration Script: MySQL to PostgreSQL
Migrates data from old MySQL database to new PostgreSQL database.

Usage:
    python scripts/migrate_mysql_to_postgres.py

Environment variables (or modify the connection strings below):
    MYSQL_URL: mysql://user:pass@host:port/database
    POSTGRES_URL: postgresql://user:pass@host:port/database
"""

import mysql.connector
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime, date
import sys

# =============================================================================
# DATABASE CONNECTIONS
# =============================================================================

MYSQL_CONFIG = {
    "host": "103.63.24.139",
    "port": 3306,
    "user": "simagisi_administrator",
    "password": "SiMaGiS1234",
    "database": "simagisi_development"
    # "database": "simagisi_production"
}

POSTGRES_CONFIG = {
    "host": "localhost",
    "port": 5432,
    "user": "postgres",
    "password": "password",
    "database": "simagis_migrate"
}

# =============================================================================
# ENUM MAPPINGS (MySQL ID -> PostgreSQL Enum Value)
# =============================================================================

MODULE_ENUM_MAP = {
    1: "GENERAL",
    2: "MEMBER",
    3: "SUPPLIER",
    4: "DEPOSIT",
    5: "RESTOCK",
    6: "CEK_GIRO",
    7: "OFFICE",
    8: "REIMBURSEMENT",
    9: "STOCK_OPNAME"
}

ROLE_ENUM_MAP = {
    1: "OWNER",
    2: "PIMPINAN",
    3: "ANGGOTA",
    4: "KASIR",
    5: "STAFF_INVENTORY",
    6: "STAFF_WAREHOUSE",
    7: "SUPER_ADMIN",
    8: "SALES",
    9: "STAFF_KANTOR",
    10: "HEAD_KANTOR"
}

# Status mapping: MySQL status_id -> PostgreSQL StatusEnum
# Format: {mysql_status_id: "POSTGRES_ENUM_VALUE"}
STATUS_ENUM_MAP = {
    1: "GENERAL_ACTIVE",
    2: "GENERAL_INACTIVE",
    3: "GENERAL_DELETED",
    4: "SUPPLIER_SENT",
    5: "SUPPLIER_RECEIVED",
    6: "DEPOSIT_SENT",
    7: "DEPOSIT_RECEIVED",
    8: "RESTOCK_WAITING_FOR_REVIEW",
    9: "RESTOCK_PAID_OFF",
    10: "RESTOCK_DEBT",
    11: "RESTOCK_RECEIVED",
    12: "RESTOCK_DELIVERED",
    13: "CEK_GIRO_NOT_USED",
    14: "CEK_GIRO_WAITING_FOR_APPROVAL",
    15: "CEK_GIRO_APPROVED",
    16: "CEK_GIRO_USED",
    17: "CEK_GIRO_FAILED",
    18: "REIMBURSEMENT_WAITING_FOR_APPROVAL",
    19: "REIMBURSEMENT_REJECTED",
    20: "REIMBURSEMENT_APPROVED",
    21: "GENERAL_ACTIVE",  # draft -> active
    22: "GENERAL_ACTIVE"   # synced -> active
}

PAYMENT_METHOD_ENUM_MAP = {
    1: "TUNAI",
    2: "DEBIT",
    3: "TRANSFER",
    4: "CEK",
    5: "GIRO"
}

PAYMENT_TYPE_ENUM_MAP = {
    1: "LUNAS",
    2: "TEMPO"
}

PRICE_TYPE_ENUM_MAP = {
    1: "ECER",
    2: "GROSIR"
}

REFUND_METHOD_ENUM_MAP = {
    1: "CASH_EXCHANGE",
    2: "GOODS_EXCHANGE",
    3: "RETURN_OF_GOODS"
}

# =============================================================================
# TABLE MAPPINGS (MySQL Table -> PostgreSQL Table)
# =============================================================================

TABLE_MAPPINGS = [
    # Level 1: Independent tables (no foreign keys)
    {
        "mysql_table": "master_bank",
        "postgres_table": "Bank",
        "columns": {
            "id": "id",
            "code": "code",
            "name": "name",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    {
        "mysql_table": "master_color",
        "postgres_table": "Color",
        "columns": {
            "id": "id",
            "code": "code",
            "name": "name",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    {
        "mysql_table": "master_reimbursement_type",
        "postgres_table": "ReimbursementType",
        "columns": {
            "id": "id",
            "code": "code",
            "name": "name",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    {
        "mysql_table": "master_cek_giro_fail_status",
        "postgres_table": "CekGiroFailStatus",
        "columns": {
            "id": "id",
            "code": "code",
            "name": "name",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    # Level 2: Tables with enum dependencies
    {
        "mysql_table": "master_user",
        "postgres_table": "User",
        "columns": {
            "id": "id",
            "code": "code",
            "name": "name",
            "email": "email",
            "username": "username",
            "phone": "phone",
            "address": "address",
            "password": "password",
            "expense_limit": "expenseLimit",
            "discount_limit": "discountLimit",
            "point": "point",
            "balance": "balance",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "enum_columns": {
            "role_id": ("role", ROLE_ENUM_MAP)
        }
    },
    {
        "mysql_table": "master_branch",
        "postgres_table": "Branch",
        "columns": {
            "id": "id",
            "code": "code",
            "name": "name",
            "phone": "phone",
            "address": "address",
            "img": "img",
            "depreciation_year1": "depreciationYear1",
            "depreciation_year2": "depreciationYear2",
            "depreciation_year3": "depreciationYear3",
            "depreciation_year4": "depreciationYear4",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "enum_columns": {
            "price_type_id": ("priceType", PRICE_TYPE_ENUM_MAP)
        }
    },
    # Level 3: Tables depending on User and Branch
    {
        "mysql_table": "master_user_branch_detail",
        "postgres_table": "UserBranchDetail",
        "columns": {
            "id": "id",
            "branch_code": "branchCode",
            "user_code": "userCode",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    {
        "mysql_table": "master_expense_category",
        "postgres_table": "ExpenseCategory",
        "columns": {
            "id": "id",
            "code": "code",
            "branch_code": "branchCode",
            "name": "name",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    {
        "mysql_table": "master_supplier",
        "postgres_table": "Supplier",
        "columns": {
            "id": "id",
            "code": "code",
            "branch_code": "branchCode",
            "name": "name",
            "address": "address",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    {
        "mysql_table": "master_member",
        "postgres_table": "Member",
        "columns": {
            "id": "id",
            "code": "code",
            "branch_code": "branchCode",
            "name": "name",
            "location": "location",
            "email": "email",
            "debt": "debt",
            "debt_limit": "debtLimit",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    {
        "mysql_table": "master_product_category",
        "postgres_table": "ProductCategory",
        "columns": {
            "id": "id",
            "code": "code",
            "branch_code": "branchCode",
            "name": "name",
            "depreciation_year1": "depreciationYear1",
            "depreciation_year2": "depreciationYear2",
            "depreciation_year3": "depreciationYear3",
            "depreciation_year4": "depreciationYear4",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    {
        "mysql_table": "master_cek_giro",
        "postgres_table": "CekGiro",
        "columns": {
            "id": "id",
            "type": "type",
            "code": "code",
            "account_number": "accountNumber",
            "date": "date",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    {
        "mysql_table": "master_account_number",
        "postgres_table": "AccountNumber",
        "columns": {
            "id": "id",
            "bank_code": "bankCode",
            "owner_code": "ownerCode",
            "account_name": "accountName",
            "account_number": "accountNumber",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "enum_columns": {
            "module_id": ("module", MODULE_ENUM_MAP)
        }
    },
    {
        "mysql_table": "master_promo",
        "postgres_table": "Promo",
        "columns": {
            "id": "id",
            "code": "code",
            "branch_code": "branchCode",
            "name": "name",
            "terms_and_condition": "termsAndCondition",
            "amount": "amount",
            "percentage": "percentage",
            "start_date": "startDate",
            "end_date": "endDate",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "default_values": {
            "status": "GENERAL_ACTIVE"
        }
    },
    {
        "mysql_table": "master_phone",
        "postgres_table": "Phone",
        "columns": {
            "id": "id",
            "owner_code": "ownerCode",
            "phone": "phone",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "enum_columns": {
            "module_id": ("module", MODULE_ENUM_MAP)
        }
    },
    # Level 4: Tables depending on Level 3
    {
        "mysql_table": "master_supplier_discount",
        "postgres_table": "SupplierDiscount",
        "columns": {
            "id": "id",
            "code": "code",
            "supplier_code": "supplierCode",
            "name": "name",
            "amount": "amount",
            "percentage": "percentage",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "date_from_int": {
            "valid_date": "validDate"
        }
    },
    {
        "mysql_table": "master_product",
        "postgres_table": "Product",
        "columns": {
            "id": "id",
            "code": "code",
            "branch_code": "branchCode",
            "product_category_code": "productCategoryCode",
            "name": "name",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    {
        "mysql_table": "master_cek_giro_detail",
        "postgres_table": "CekGiroDetail",
        "columns": {
            "id": "id",
            "code": "code",
            "cek_giro_code": "cekGiroCode",
            "account_number": "accountNumber",
            "account_name": "accountName",
            "amount": "amount",
            "receiver_name": "receiverName",
            "receiver_phone": "receiverPhone",
            "disbursement_date": "disbursementDate",
            "handover_date": "handoverDate",
            "note": "note",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    {
        "mysql_table": "master_cek_giro_owner",
        "postgres_table": "CekGiroOwner",
        "columns": {
            "id": "id",
            "cek_giro_code": "cekGiroCode",
            "user_code": "userCode",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    # Level 5: Product Details
    {
        "mysql_table": "master_product_detail",
        "postgres_table": "ProductDetail",
        "columns": {
            "id": "id",
            "code": "code",
            "product_code": "productCode",
            "color_code": "colorCode",
            "supplier_code": "supplierCode",
            "article": "article",
            "size": "size",
            "purchase_price": "purchasePrice",
            "sales_price": "salesPrice",
            "wholesale_price": "wholesalePrice",
            "stock": "stock",
            "purchase_date": "purchaseDate",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "enum_columns": {
            "status_id": ("status", STATUS_ENUM_MAP)
        }
    },
    # Level 6: Stock Operations
    {
        "mysql_table": "master_stock_opname",
        "postgres_table": "StockOpname",
        "columns": {
            "id": "id",
            "code": "code",
            "branch_code": "branchCode",
            "year": "year",
            "month": "month",
            "created_by": "createdBy",
            "updated_by": "updatedBy",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "enum_columns": {
            "status_id": ("status", STATUS_ENUM_MAP)
        }
    },
    {
        "mysql_table": "master_stock_opname_detail",
        "postgres_table": "StockOpnameDetail",
        "columns": {
            "id": "id",
            "stock_opname_code": "stockOpnameCode",
            "product_detail_code": "productDetailCode",
            "stock_system": "stockSystem",
            "stock_actual": "stockActual",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    {
        "mysql_table": "transaction_cash_register",
        "postgres_table": "CashRegister",
        "columns": {
            "id": "id",
            "code": "code",
            "branch_code": "branchCode",
            "user_code": "userCode",
            "date": "date",
            "amount": "amount",
            "p100000": "p100000",
            "p50000": "p50000",
            "p20000": "p20000",
            "p10000": "p10000",
            "p5000": "p5000",
            "p2000": "p2000",
            "p1000": "p1000",
            "p500": "p500",
            "p200": "p200",
            "p100": "p100",
            "p50": "p50",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    {
        "mysql_table": "transaction_closing",
        "postgres_table": "Closing",
        "columns": {
            "id": "id",
            "code": "code",
            "branch_code": "branchCode",
            "user_code": "userCode",
            "date": "date",
            "amount": "amount",
            "debit": "debit",
            "p100000": "p100000",
            "p50000": "p50000",
            "p20000": "p20000",
            "p10000": "p10000",
            "p5000": "p5000",
            "p2000": "p2000",
            "p1000": "p1000",
            "p500": "p500",
            "p200": "p200",
            "p100": "p100",
            "p50": "p50",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    {
        "mysql_table": "transaction_deposit",
        "postgres_table": "Deposit",
        "columns": {
            "id": "id",
            "code": "code",
            "branch_code": "branchCode",
            "user_code": "userCode",
            "date": "date",
            "amount": "amount",
            "note": "note",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "enum_columns": {
            "status_id": ("status", STATUS_ENUM_MAP)
        }
    },
    {
        "mysql_table": "transaction_expense",
        "postgres_table": "Expense",
        "columns": {
            "id": "id",
            "code": "code",
            "branch_code": "branchCode",
            "expense_category_code": "expenseCategoryCode",
            "user_code": "userCode",
            "date": "date",
            "amount": "amount",
            "description": "description",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        }
    },
    # Level 7: Orders and transactions
    {
        "mysql_table": "transaction_order",
        "postgres_table": "Order",
        "columns": {
            "id": "id",
            "branch_code": "branchCode",
            "member_code": "memberCode",
            "total_price": "totalPrice",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "enum_columns": {
            "payment_type_id": ("paymentType", PAYMENT_TYPE_ENUM_MAP)
        },
        "rename_columns": {
            "invoice": "code",
            "created_by": "userCode"
        }
    },
    {
        "mysql_table": "transaction_order_detail",
        "postgres_table": "OrderDetail",
        "columns": {
            "id": "id",
            "user_code": "userCode",
            "product_detail_code": "productDetailCode",
            "quantity": "quantity",
            "total_price": "totalPrice",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "enum_columns": {
            "price_type_id": ("priceType", PRICE_TYPE_ENUM_MAP)
        },
        "rename_columns": {
            "invoice": "orderCode",
            "discount": "discountAmount"
        },
        "auto_generate": {
            "code": "ORDD"
        }
    },
    {
        "mysql_table": "transaction_order_discount",
        "postgres_table": "OrderDiscount",
        "columns": {
            "id": "id",
            "user_code": "userCode",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "rename_columns": {
            "invoice": "orderCode",
            "invoice_discount": "invoiceDiscountAmount",
            "order_discount": "productDiscountAmount",
            "promo_discount": "promoDiscountAmount"
        },
        "auto_generate": {
            "code": "ORDDISC"
        }
    },
    {
        "mysql_table": "transaction_payment",
        "postgres_table": "Payment",
        "columns": {
            "id": "id",
            "code": "code",
            "customer_amount": "customerAmount",
            "amount": "amount",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "enum_columns": {
            "payment_method_id": ("paymentMethod", PAYMENT_METHOD_ENUM_MAP)
        },
        "rename_columns": {
            "invoice": "orderCode"
        }
    },
    {
        "mysql_table": "transaction_payment_billing",
        "postgres_table": "PaymentBilling",
        "columns": {
            "id": "id",
            "code": "code",
            "member_code": "memberCode",
            "user_code": "userCode",
            "amount": "amount",
            "discount": "discount",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "enum_columns": {
            "payment_method_id": ("paymentMethod", PAYMENT_METHOD_ENUM_MAP)
        }
    },
    {
        "mysql_table": "transaction_refund",
        "postgres_table": "Refund",
        "columns": {
            "id": "id",
            "code": "code",
            "user_code": "userCode",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "rename_columns": {
            "invoice": "orderCode"
        }
    },
    {
        "mysql_table": "transaction_refund_detail",
        "postgres_table": "RefundDetail",
        "columns": {
            "id": "id",
            "refund_code": "refundCode",
            "product_detail_code": "orderDetailCode",
            "quantity": "quantity",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "enum_columns": {
            "refund_method_id": ("refundMethod", REFUND_METHOD_ENUM_MAP)
        },
        "auto_generate": {
            "code": "REFD"
        }
    },
    # Level 8: Restock operations
    {
        "mysql_table": "transaction_restock",
        "postgres_table": "Restock",
        "columns": {
            "id": "id",
            "code": "code",
            "branch_code": "branchCode",
            "user_code": "userCode",
            "supplier_code": "supplierCode",
            "supplier_discount_code": "supplierDiscountCode",
            "purchase_date": "purchaseDate",
            "note": "note",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "enum_columns": {
            "status_id": ("status", STATUS_ENUM_MAP),
            "payment_status_id": ("paymentStatus", STATUS_ENUM_MAP)
        },
        "rename_columns": {
            "receive_date": "receivedDate"
        }
    },
    {
        "mysql_table": "transaction_restock_detail",
        "postgres_table": "RestockDetail",
        "columns": {
            "id": "id",
            "restock_code": "restockCode",
            "product_detail_code": "productDetailCode",
            "quantity": "quantity",
            "created_at": "createdAt",
            "updated_at": "updatedAt"
        },
        "auto_generate": {
            "code": "RSTD"
        }
    }
]

# =============================================================================
# MIGRATION FUNCTIONS
# =============================================================================

def get_mysql_connection():
    """Create MySQL connection."""
    return mysql.connector.connect(**MYSQL_CONFIG)

def get_postgres_connection():
    """Create PostgreSQL connection."""
    return psycopg2.connect(**POSTGRES_CONFIG)

def convert_value(value, target_type=None):
    """Convert MySQL value to PostgreSQL compatible value."""
    if value is None:
        return None
    if isinstance(value, datetime):
        return value
    if isinstance(value, date):
        return value
    if isinstance(value, bytes):
        return value.decode('utf-8')
    return value

def migrate_table(mysql_conn, pg_conn, mapping):
    """Migrate a single table from MySQL to PostgreSQL."""
    mysql_table = mapping["mysql_table"]
    postgres_table = mapping["postgres_table"]
    columns = mapping.get("columns", {})
    enum_columns = mapping.get("enum_columns", {})
    rename_columns = mapping.get("rename_columns", {})
    default_values = mapping.get("default_values", {})
    auto_generate = mapping.get("auto_generate", {})
    date_from_int = mapping.get("date_from_int", {})

    print(f"\nMigrating {mysql_table} -> {postgres_table}...")

    # Build SELECT query for MySQL
    mysql_cols = list(columns.keys()) + list(enum_columns.keys()) + list(rename_columns.keys()) + list(date_from_int.keys())
    mysql_cols = [f"`{col}`" for col in mysql_cols]

    mysql_cursor = mysql_conn.cursor(dictionary=True)
    mysql_cursor.execute(f"SELECT {', '.join(mysql_cols)} FROM `{mysql_table}`")
    rows = mysql_cursor.fetchall()

    if not rows:
        print(f"  No data to migrate.")
        mysql_cursor.close()
        return 0

    # Build INSERT query for PostgreSQL
    pg_cols = []
    for mysql_col, pg_col in columns.items():
        pg_cols.append(pg_col)
    for mysql_col, (pg_col, _) in enum_columns.items():
        pg_cols.append(pg_col)
    for mysql_col, pg_col in rename_columns.items():
        pg_cols.append(pg_col)
    for mysql_col, pg_col in date_from_int.items():
        pg_cols.append(pg_col)
    for pg_col in default_values.keys():
        pg_cols.append(pg_col)
    for pg_col in auto_generate.keys():
        pg_cols.append(pg_col)

    # Prepare data for insertion
    pg_data = []
    auto_gen_counter = 1

    for row in rows:
        pg_row = []

        # Regular columns
        for mysql_col, pg_col in columns.items():
            pg_row.append(convert_value(row.get(mysql_col)))

        # Enum columns
        for mysql_col, (pg_col, enum_map) in enum_columns.items():
            mysql_val = row.get(mysql_col)
            if mysql_val is not None:
                pg_row.append(enum_map.get(mysql_val, None))
            else:
                pg_row.append(None)

        # Renamed columns
        for mysql_col, pg_col in rename_columns.items():
            pg_row.append(convert_value(row.get(mysql_col)))

        # Date from int columns
        for mysql_col, pg_col in date_from_int.items():
            int_val = row.get(mysql_col)
            if int_val is not None:
                try:
                    pg_row.append(datetime.fromtimestamp(int_val))
                except:
                    pg_row.append(None)
            else:
                pg_row.append(None)

        # Default values
        for pg_col, default_val in default_values.items():
            pg_row.append(default_val)

        # Auto-generated codes
        for pg_col, prefix in auto_generate.items():
            pg_row.append(f"{prefix}-{auto_gen_counter:08d}")
            auto_gen_counter += 1

        pg_data.append(tuple(pg_row))

    # Insert into PostgreSQL
    pg_cursor = pg_conn.cursor()

    # Disable triggers temporarily for faster inserts
    pg_cursor.execute(f'ALTER TABLE "{postgres_table}" DISABLE TRIGGER ALL')

    # Clear existing data
    pg_cursor.execute(f'DELETE FROM "{postgres_table}"')

    # Build and execute INSERT
    quoted_cols = [f'"{col}"' for col in pg_cols]
    placeholders = ", ".join(["%s"] * len(pg_cols))
    insert_sql = f'INSERT INTO "{postgres_table}" ({", ".join(quoted_cols)}) VALUES ({placeholders})'

    try:
        pg_cursor.executemany(insert_sql, pg_data)

        # Reset sequence
        pg_cursor.execute(f'''
            SELECT setval(pg_get_serial_sequence('"{postgres_table}"', 'id'),
                          COALESCE((SELECT MAX(id) FROM "{postgres_table}"), 1))
        ''')

        pg_cursor.execute(f'ALTER TABLE "{postgres_table}" ENABLE TRIGGER ALL')
        pg_conn.commit()
        print(f"  Migrated {len(pg_data)} rows.")
        return len(pg_data)
    except Exception as e:
        pg_conn.rollback()
        print(f"  ERROR: {e}")
        # Re-enable triggers
        pg_cursor.execute(f'ALTER TABLE "{postgres_table}" ENABLE TRIGGER ALL')
        pg_conn.commit()
        return 0
    finally:
        mysql_cursor.close()
        pg_cursor.close()

def disable_foreign_keys(pg_conn):
    """Disable foreign key checks in PostgreSQL."""
    cursor = pg_conn.cursor()
    cursor.execute("SET session_replication_role = 'replica';")
    pg_conn.commit()
    cursor.close()

def enable_foreign_keys(pg_conn):
    """Enable foreign key checks in PostgreSQL."""
    cursor = pg_conn.cursor()
    cursor.execute("SET session_replication_role = 'origin';")
    pg_conn.commit()
    cursor.close()

def main():
    """Main migration function."""
    print("=" * 60)
    print("MySQL to PostgreSQL Migration Script")
    print("=" * 60)

    # Connect to databases
    print("\nConnecting to MySQL...")
    mysql_conn = get_mysql_connection()
    print("Connected to MySQL.")

    print("Connecting to PostgreSQL...")
    pg_conn = get_postgres_connection()
    print("Connected to PostgreSQL.")

    # Disable foreign key checks
    print("\nDisabling foreign key checks...")
    disable_foreign_keys(pg_conn)

    # Migrate tables
    total_rows = 0
    success_count = 0

    for mapping in TABLE_MAPPINGS:
        try:
            rows = migrate_table(mysql_conn, pg_conn, mapping)
            total_rows += rows
            if rows > 0:
                success_count += 1
        except Exception as e:
            print(f"  FAILED: {e}")

    # Enable foreign key checks
    print("\nEnabling foreign key checks...")
    enable_foreign_keys(pg_conn)

    # Close connections
    mysql_conn.close()
    pg_conn.close()

    print("\n" + "=" * 60)
    print(f"Migration Complete!")
    print(f"Tables migrated: {success_count}/{len(TABLE_MAPPINGS)}")
    print(f"Total rows migrated: {total_rows}")
    print("=" * 60)

if __name__ == "__main__":
    main()
