-- # Write your MySQL query statement below "QUERY SOLUTION"
SELECT
    CUSTOMER_ID,
    COUNT(*) AS count_no_trans
FROM
    VISITS
    LEFT JOIN TRANSACTIONS ON TRANSACTIONS.VISIT_ID = VISITS.VISIT_ID
WHERE
    TRANSACTION_ID IS NULL
GROUP BY
    CUSTOMER_ID
ORDER BY
    count_no_trans DESC;

-- # DATABASE SETUP FOR TESTING THE QUERIES
-- CREATE VISITS TABLE
CREATE TABLE
    IF NOT EXISTS VISITS (
        VISIT_ID INT (11) PRIMARY KEY AUTO_INCREMENT,
        CUSTOMER_ID INT (11) NOT NULL
    );

-- CREATE TRANSACTIONS TABLE
CREATE TABLE
    IF NOT EXISTS TRANSACTIONS (
        TRANSACTION_ID INT (11) PRIMARY KEY AUTO_INCREMENT,
        VISIT_ID INT (11) NOT NULL,
        AMOUNT INT (1024) NOT NULL,
        FOREIGN KEY (VISIT_ID) REFERENCES VISITS (VISIT_ID) ON DELETE CASCADE ON UPDATE CASCADE
    );

-- Visits
-- +----------+-------------+
-- | visit_id | customer_id |
-- +----------+-------------+
-- | 1        | 23          |
-- | 2        | 9           |
-- | 4        | 30          |
-- | 5        | 54          |
-- | 6        | 96          |
-- | 7        | 54          |
-- | 8        | 54          |
-- +----------+-------------+
INSERT INTO
    VISITS (VISIT_ID, CUSTOMER_ID)
VALUES
    (1, 23),
    (2, 9),
    (4, 30),
    (5, 54),
    (6, 96),
    (7, 54),
    (8, 54);

-- Transactions
-- +----------------+----------+--------+
-- | transaction_id | visit_id | amount |
-- +----------------+----------+--------+
-- | 2              | 5        | 310    |
-- | 3              | 5        | 300    |
-- | 9              | 5        | 200    |
-- | 12             | 1        | 910    |
-- | 13             | 2        | 970    |
-- +----------------+----------+--------+
INSERT INTO
    TRANSACTIONS (TRANSACTION_ID, VISIT_ID, AMOUNT)
VALUES
    (2, 5, 310),
    (3, 5, 300),
    (9, 5, 200),
    (12, 1, 910),
    (13, 2, 970);