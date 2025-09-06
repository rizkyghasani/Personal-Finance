--
-- PostgreSQL database dump
--

\restrict fKIxks5DRmHUTb3CgwdPnZ6fIfgFXY32lGD0pUfzG9V9cz92AGUHLQ7vWde8dxE

-- Dumped from database version 13.22 (Debian 13.22-1.pgdg13+1)
-- Dumped by pg_dump version 13.22 (Debian 13.22-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: budgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budgets (
    id integer NOT NULL,
    user_id integer NOT NULL,
    category_id integer NOT NULL,
    amount numeric(15,2) NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.budgets OWNER TO postgres;

--
-- Name: budgets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.budgets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.budgets_id_seq OWNER TO postgres;

--
-- Name: budgets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.budgets_id_seq OWNED BY public.budgets.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    CONSTRAINT categories_type_check CHECK (((type)::text = ANY ((ARRAY['income'::character varying, 'expense'::character varying])::text[])))
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    amount numeric(15,2) NOT NULL,
    type character varying(50) NOT NULL,
    category_id integer,
    description text,
    date date NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT transactions_type_check CHECK (((type)::text = ANY ((ARRAY['income'::character varying, 'expense'::character varying])::text[])))
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: budgets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets ALTER COLUMN id SET DEFAULT nextval('public.budgets_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: budgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budgets (id, user_id, category_id, amount, month, year, created_at) FROM stdin;
1	1	4	620000.00	8	2025	2025-08-25 12:39:53.475541+00
4	1	5	100000.00	8	2025	2025-08-26 03:50:33.042388+00
5	2	4	300000.00	8	2025	2025-08-26 07:34:55.107851+00
6	2	6	1500000.00	8	2025	2025-08-26 07:35:02.611708+00
7	2	7	350000.00	8	2025	2025-08-26 07:35:23.12096+00
8	2	8	250000.00	8	2025	2025-08-26 07:36:20.530946+00
9	1	9	120000.00	8	2025	2025-08-26 08:23:45.48741+00
10	1	8	250000.00	8	2025	2025-08-28 05:33:27.375967+00
11	1	6	200000.00	8	2025	2025-08-28 05:35:17.130864+00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, type) FROM stdin;
1	Gaji	income
2	Hadiah	income
3	Penjualan	income
4	Makanan	expense
5	Transportasi	expense
6	Belanja	expense
7	Tagihan	expense
8	Hiburan	expense
9	Kucing	expense
10	Mobil	expense
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, user_id, amount, type, category_id, description, date, created_at) FROM stdin;
1	1	1000000.00	income	1	gaji dari membuat website	2025-08-24	2025-08-24 07:25:49.919786+00
2	1	5000.00	expense	5	bayar parkir	2025-08-24	2025-08-24 07:26:08.220337+00
3	1	57000.00	expense	8	nongkrong	2025-08-25	2025-08-25 06:32:03.283981+00
4	1	350000.00	expense	6	beli pakaian di mall	2025-08-25	2025-08-25 06:36:31.851221+00
5	1	250000.00	income	2	hadiah karena berhasil commit ke github	2025-08-25	2025-08-25 06:37:14.40943+00
6	1	32000.00	expense	7	bayar langganan spotify	2025-08-25	2025-08-25 06:47:27.767887+00
7	1	2000.00	expense	5	bayar parkir	2025-08-25	2025-08-25 06:56:14.483708+00
8	2	650000.00	income	1	tes tes	2025-08-25	2025-08-25 07:41:44.824847+00
9	2	520000.00	expense	6	tes email	2025-08-25	2025-08-25 07:42:15.892206+00
10	3	720000.00	income	2	testing	2025-08-25	2025-08-25 07:51:21.91616+00
12	2	1000000.00	income	1	gaji test	2025-08-25	2025-08-25 07:54:05.953398+00
13	2	700000.00	expense	6	beli tas	2025-08-25	2025-08-25 07:54:25.638485+00
14	4	9000000.00	income	1	Gaji RS	2025-08-25	2025-08-25 07:58:39.454748+00
15	4	650000.00	expense	6	Belanja Bulanan	2025-08-25	2025-08-25 07:59:01.17047+00
16	3	630000.00	expense	6	beli sepatu lari	2025-08-25	2025-08-25 12:20:10.009904+00
17	2	400000.00	income	1	gaji 	2025-08-25	2025-08-25 12:22:00.113736+00
18	2	502000.00	expense	7	tagihan listrik	2025-08-25	2025-08-25 12:22:31.462612+00
19	1	120000.00	expense	4	beli pizza	2025-08-26	2025-08-26 03:40:02.290172+00
20	2	57000.00	expense	8	nonton	2025-08-26	2025-08-26 07:36:07.99898+00
21	1	18000.00	expense	4	beli kebab	2025-08-26	2025-08-26 07:56:02.12393+00
22	1	1.00	expense	4	tes	2025-08-26	2025-08-26 08:06:16.709485+00
23	1	2.00	expense	4	tes2	2025-08-26	2025-08-26 08:06:26.173696+00
24	1	3.00	expense	4	tes4	2025-08-26	2025-08-26 08:06:36.378884+00
25	1	65.00	expense	4	res	2025-08-26	2025-08-26 08:06:45.344026+00
26	1	43.00	expense	4	tes33	2025-08-26	2025-08-26 08:06:54.023571+00
27	1	32.00	expense	4	tesr	2025-08-26	2025-08-26 08:07:02.918216+00
28	1	20000.00	expense	6	beli alat	2025-08-28	2025-08-28 05:34:08.102588+00
29	1	35000.00	expense	9	beli dryfood	2025-08-28	2025-08-28 05:35:47.980918+00
30	2	4000000.00	income	1	Bulanan	2025-09-01	2025-09-06 04:45:36.141754+00
31	2	1450000.00	expense	7	Bayar kos	2025-09-01	2025-09-06 04:45:55.254803+00
32	2	176000.00	expense	6	mosturizer & odol	2025-09-06	2025-09-06 04:46:44.683871+00
33	2	20000.00	expense	5	cuci motor	2025-09-04	2025-09-06 04:47:37.550954+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, created_at) FROM stdin;
3	rizkyghasani	rizkyghasani@gmail.com	$2a$10$h2ZjTk/bxu9XuOT0dAZ2fO7MUhtRxvuPV0y3FUA.OOpFQnClMRXTe	2025-08-25 07:49:39.777852+00
4	SalsaChairul	salsachairul85@gmail.com	$2a$10$QGrb.agc8Ad/ZcCYe5dXk.RvQdMgOUHiQ5NcuS0T3S5TYZysjGm7e	2025-08-25 07:57:30.780366+00
1	kiki	kiki@gmail.com	$2a$10$FUZJcKTeo/DUCGKZNhXKjOcg4rieT5YHI.4n2DpPkwiYs/Bm7k31W	2025-08-24 05:34:18.171865+00
2	NANOO	ghsnirzky@gmail.com	$2a$10$rcZ2Wf0mrBTaKoQfqP4t/u8/0IWwUUj/CDml8BKkRPXPzdpT2leRm	2025-08-25 07:41:15.843455+00
\.


--
-- Name: budgets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.budgets_id_seq', 11, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 10, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 33, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: budgets budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: budgets unique_budget_per_month; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT unique_budget_per_month UNIQUE (user_id, category_id, month, year);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: budgets budgets_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: budgets budgets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict fKIxks5DRmHUTb3CgwdPnZ6fIfgFXY32lGD0pUfzG9V9cz92AGUHLQ7vWde8dxE

