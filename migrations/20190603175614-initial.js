'use strict';

let pg = require('pg')
let initialMigration = `

--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3
-- Dumped by pg_dump version 11.3

SELECT pg_catalog.set_config('search_path', 'public', false);

--
-- Name: enum_consumption_type; Type: TYPE; Schema: public; Owner: hubot
--

CREATE TYPE public.enum_consumption_type AS ENUM (
    'minute',
    'hour',
    'day',
    'month',
    'year'
);



--
-- Name: alarms; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.alarms (
    id integer NOT NULL,
    created timestamp with time zone,
    value integer,
    last_event bigint,
    channel bigint,
    slave_id integer
);

--
-- Name: alarms_id_seq; Type: SEQUENCE; Schema: public; Owner: hubot
--

CREATE SEQUENCE public.alarms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: alarms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubot
--

ALTER SEQUENCE public.alarms_id_seq OWNED BY public.alarms.id;


--
-- Name: ambients; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.ambients (
    id integer NOT NULL,
    name character varying(255),
    image text
);


--
-- Name: ambients_id_seq; Type: SEQUENCE; Schema: public; Owner: hubot
--

CREATE SEQUENCE public.ambients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ambients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubot
--

ALTER SEQUENCE public.ambients_id_seq OWNED BY public.ambients.id;


--
-- Name: ambients_rfir_devices_rel; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.ambients_rfir_devices_rel (
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    rfir_device_id integer NOT NULL,
    ambient_id integer NOT NULL
);


--
-- Name: ambients_rfir_slaves_rel; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.ambients_rfir_slaves_rel (
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    slave_id integer NOT NULL,
    ambient_id integer NOT NULL
);


--
-- Name: channels; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.channels (
    id integer NOT NULL,
    type character varying(255),
    channel integer,
    name character varying(255),
    description character varying(255),
    channel_id integer,
    slave_id integer,
    scene_id integer
);


--
-- Name: channels_id_seq; Type: SEQUENCE; Schema: public; Owner: hubot
--

CREATE SEQUENCE public.channels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: channels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubot
--

ALTER SEQUENCE public.channels_id_seq OWNED BY public.channels.id;


--
-- Name: consumption; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.consumption (
    id integer NOT NULL,
    "timestamp" timestamp with time zone,
    slave_id integer,
    ambient_id integer,
    value real,
    type public.enum_consumption_type
);


--
-- Name: consumption_alerts; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.consumption_alerts (
    id integer NOT NULL,
    slave_id integer,
    type character varying(255),
    extra text
);


--
-- Name: consumption_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: hubot
--

CREATE SEQUENCE public.consumption_alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: consumption_alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubot
--

ALTER SEQUENCE public.consumption_alerts_id_seq OWNED BY public.consumption_alerts.id;


--
-- Name: consumption_id_seq; Type: SEQUENCE; Schema: public; Owner: hubot
--

CREATE SEQUENCE public.consumption_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: consumption_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubot
--

ALTER SEQUENCE public.consumption_id_seq OWNED BY public.consumption.id;


--
-- Name: metadata; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.metadata (
    id integer NOT NULL,
    type character varying(255),
    action character varying(255),
    "timestamp" timestamp with time zone,
    data text,
    "user" character varying(255)
);


--
-- Name: metadata_id_seq; Type: SEQUENCE; Schema: public; Owner: hubot
--

CREATE SEQUENCE public.metadata_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: metadata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubot
--

ALTER SEQUENCE public.metadata_id_seq OWNED BY public.metadata.id;


--
-- Name: raw_energy; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.raw_energy (
    id integer NOT NULL,
    value integer,
    datetime integer,
    slave_id integer,
    rfir_remote_id integer
);


--
-- Name: raw_energy_id_seq; Type: SEQUENCE; Schema: public; Owner: hubot
--

CREATE SEQUENCE public.raw_energy_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: raw_energy_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubot
--

ALTER SEQUENCE public.raw_energy_id_seq OWNED BY public.raw_energy.id;


--
-- Name: rfir_buttons; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.rfir_buttons (
    id integer NOT NULL,
    name character varying(255),
    indexes character varying(255),
    color integer,
    type character varying(255),
    rfir_remote_id integer,
    rfir_command_id integer
);


--
-- Name: rfir_buttons_id_seq; Type: SEQUENCE; Schema: public; Owner: hubot
--

CREATE SEQUENCE public.rfir_buttons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rfir_buttons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubot
--

ALTER SEQUENCE public.rfir_buttons_id_seq OWNED BY public.rfir_buttons.id;


--
-- Name: rfir_commands; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.rfir_commands (
    id integer NOT NULL,
    name character varying(255),
    page_low integer,
    page_high integer,
    rfir_device_id integer
);


--
-- Name: rfir_commands_id_seq; Type: SEQUENCE; Schema: public; Owner: hubot
--

CREATE SEQUENCE public.rfir_commands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rfir_commands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubot
--

ALTER SEQUENCE public.rfir_commands_id_seq OWNED BY public.rfir_commands.id;


--
-- Name: rfir_devices; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.rfir_devices (
    id integer NOT NULL,
    type character varying(255),
    category character varying(255),
    name character varying(255),
    description character varying(255),
    output character varying(255),
    slave_id integer,
    command_on_id integer,
    command_off_id integer
);


--
-- Name: rfir_devices_id_seq; Type: SEQUENCE; Schema: public; Owner: hubot
--

CREATE SEQUENCE public.rfir_devices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rfir_devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubot
--

ALTER SEQUENCE public.rfir_devices_id_seq OWNED BY public.rfir_devices.id;


--
-- Name: rfir_remotes; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.rfir_remotes (
    id integer NOT NULL,
    name character varying(255),
    rfir_device_id integer
);


--
-- Name: rfir_remotes_id_seq; Type: SEQUENCE; Schema: public; Owner: hubot
--

CREATE SEQUENCE public.rfir_remotes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: rfir_remotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubot
--

ALTER SEQUENCE public.rfir_remotes_id_seq OWNED BY public.rfir_remotes.id;


--
-- Name: scenes; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.scenes (
    id integer NOT NULL,
    json text,
    description character varying(255),
    name character varying(255),
    color character varying(255)
);



--
-- Name: scenes_id_seq; Type: SEQUENCE; Schema: public; Owner: hubot
--

CREATE SEQUENCE public.scenes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: scenes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubot
--

ALTER SEQUENCE public.scenes_id_seq OWNED BY public.scenes.id;


--
-- Name: schedules; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.schedules (
    id integer NOT NULL,
    action json,
    name character varying(255),
    cron character varying(255),
    active boolean
);



--
-- Name: schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: hubot
--

CREATE SEQUENCE public.schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- Name: schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubot
--

ALTER SEQUENCE public.schedules_id_seq OWNED BY public.schedules.id;


--
-- Name: slaves; Type: TABLE; Schema: public; Owner: hubot
--

CREATE TABLE public.slaves (
    id integer NOT NULL,
    type character varying(255),
    addr_low integer,
    addr_high integer,
    channels integer,
    name character varying(255),
    description character varying(255),
    color character varying(255),
    code character varying(255),
    operation_mode character varying(255),
    regular_consumption integer,
    is_triphase boolean
);



--
-- Name: slaves_id_seq; Type: SEQUENCE; Schema: public; Owner: hubot
--

CREATE SEQUENCE public.slaves_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: slaves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hubot
--

ALTER SEQUENCE public.slaves_id_seq OWNED BY public.slaves.id;


--
-- Name: alarms id; Type: DEFAULT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.alarms ALTER COLUMN id SET DEFAULT nextval('public.alarms_id_seq'::regclass);


--
-- Name: ambients id; Type: DEFAULT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.ambients ALTER COLUMN id SET DEFAULT nextval('public.ambients_id_seq'::regclass);


--
-- Name: channels id; Type: DEFAULT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.channels ALTER COLUMN id SET DEFAULT nextval('public.channels_id_seq'::regclass);


--
-- Name: consumption id; Type: DEFAULT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.consumption ALTER COLUMN id SET DEFAULT nextval('public.consumption_id_seq'::regclass);


--
-- Name: consumption_alerts id; Type: DEFAULT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.consumption_alerts ALTER COLUMN id SET DEFAULT nextval('public.consumption_alerts_id_seq'::regclass);


--
-- Name: metadata id; Type: DEFAULT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.metadata ALTER COLUMN id SET DEFAULT nextval('public.metadata_id_seq'::regclass);


--
-- Name: raw_energy id; Type: DEFAULT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.raw_energy ALTER COLUMN id SET DEFAULT nextval('public.raw_energy_id_seq'::regclass);


--
-- Name: rfir_buttons id; Type: DEFAULT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.rfir_buttons ALTER COLUMN id SET DEFAULT nextval('public.rfir_buttons_id_seq'::regclass);


--
-- Name: rfir_commands id; Type: DEFAULT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.rfir_commands ALTER COLUMN id SET DEFAULT nextval('public.rfir_commands_id_seq'::regclass);


--
-- Name: rfir_devices id; Type: DEFAULT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.rfir_devices ALTER COLUMN id SET DEFAULT nextval('public.rfir_devices_id_seq'::regclass);


--
-- Name: rfir_remotes id; Type: DEFAULT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.rfir_remotes ALTER COLUMN id SET DEFAULT nextval('public.rfir_remotes_id_seq'::regclass);


--
-- Name: scenes id; Type: DEFAULT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.scenes ALTER COLUMN id SET DEFAULT nextval('public.scenes_id_seq'::regclass);


--
-- Name: schedules id; Type: DEFAULT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.schedules ALTER COLUMN id SET DEFAULT nextval('public.schedules_id_seq'::regclass);


--
-- Name: slaves id; Type: DEFAULT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.slaves ALTER COLUMN id SET DEFAULT nextval('public.slaves_id_seq'::regclass);


--
-- Name: alarms alarms_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.alarms
    ADD CONSTRAINT alarms_pkey PRIMARY KEY (id);


--
-- Name: ambients ambients_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.ambients
    ADD CONSTRAINT ambients_pkey PRIMARY KEY (id);


--
-- Name: ambients_rfir_devices_rel ambients_rfir_devices_rel_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.ambients_rfir_devices_rel
    ADD CONSTRAINT ambients_rfir_devices_rel_pkey PRIMARY KEY (rfir_device_id, ambient_id);


--
-- Name: ambients_rfir_slaves_rel ambients_rfir_slaves_rel_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.ambients_rfir_slaves_rel
    ADD CONSTRAINT ambients_rfir_slaves_rel_pkey PRIMARY KEY (slave_id, ambient_id);


--
-- Name: channels channels_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_pkey PRIMARY KEY (id);


--
-- Name: consumption_alerts consumption_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.consumption_alerts
    ADD CONSTRAINT consumption_alerts_pkey PRIMARY KEY (id);


--
-- Name: consumption consumption_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.consumption
    ADD CONSTRAINT consumption_pkey PRIMARY KEY (id);


--
-- Name: metadata metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.metadata
    ADD CONSTRAINT metadata_pkey PRIMARY KEY (id);


--
-- Name: raw_energy raw_energy_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.raw_energy
    ADD CONSTRAINT raw_energy_pkey PRIMARY KEY (id);


--
-- Name: rfir_buttons rfir_buttons_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.rfir_buttons
    ADD CONSTRAINT rfir_buttons_pkey PRIMARY KEY (id);


--
-- Name: rfir_commands rfir_commands_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.rfir_commands
    ADD CONSTRAINT rfir_commands_pkey PRIMARY KEY (id);


--
-- Name: rfir_devices rfir_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.rfir_devices
    ADD CONSTRAINT rfir_devices_pkey PRIMARY KEY (id);


--
-- Name: rfir_remotes rfir_remotes_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.rfir_remotes
    ADD CONSTRAINT rfir_remotes_pkey PRIMARY KEY (id);


--
-- Name: scenes scenes_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.scenes
    ADD CONSTRAINT scenes_pkey PRIMARY KEY (id);


--
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- Name: slaves slaves_pkey; Type: CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.slaves
    ADD CONSTRAINT slaves_pkey PRIMARY KEY (id);


--
-- Name: alarms alarms_slave_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.alarms
    ADD CONSTRAINT alarms_slave_id_fkey FOREIGN KEY (slave_id) REFERENCES public.slaves(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ambients_rfir_devices_rel ambients_rfir_devices_rel_ambient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.ambients_rfir_devices_rel
    ADD CONSTRAINT ambients_rfir_devices_rel_ambient_id_fkey FOREIGN KEY (ambient_id) REFERENCES public.ambients(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ambients_rfir_devices_rel ambients_rfir_devices_rel_rfir_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.ambients_rfir_devices_rel
    ADD CONSTRAINT ambients_rfir_devices_rel_rfir_device_id_fkey FOREIGN KEY (rfir_device_id) REFERENCES public.rfir_devices(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ambients_rfir_slaves_rel ambients_rfir_slaves_rel_ambient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.ambients_rfir_slaves_rel
    ADD CONSTRAINT ambients_rfir_slaves_rel_ambient_id_fkey FOREIGN KEY (ambient_id) REFERENCES public.ambients(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ambients_rfir_slaves_rel ambients_rfir_slaves_rel_slave_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.ambients_rfir_slaves_rel
    ADD CONSTRAINT ambients_rfir_slaves_rel_slave_id_fkey FOREIGN KEY (slave_id) REFERENCES public.slaves(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: channels channels_channel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: channels channels_scene_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_scene_id_fkey FOREIGN KEY (scene_id) REFERENCES public.scenes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: channels channels_slave_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_slave_id_fkey FOREIGN KEY (slave_id) REFERENCES public.slaves(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: consumption_alerts consumption_alerts_slave_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.consumption_alerts
    ADD CONSTRAINT consumption_alerts_slave_id_fkey FOREIGN KEY (slave_id) REFERENCES public.slaves(id) ON UPDATE CASCADE;


--
-- Name: raw_energy raw_energy_rfir_remote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.raw_energy
    ADD CONSTRAINT raw_energy_rfir_remote_id_fkey FOREIGN KEY (rfir_remote_id) REFERENCES public.rfir_remotes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: raw_energy raw_energy_slave_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.raw_energy
    ADD CONSTRAINT raw_energy_slave_id_fkey FOREIGN KEY (slave_id) REFERENCES public.slaves(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: rfir_buttons rfir_buttons_rfir_command_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.rfir_buttons
    ADD CONSTRAINT rfir_buttons_rfir_command_id_fkey FOREIGN KEY (rfir_command_id) REFERENCES public.rfir_commands(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: rfir_buttons rfir_buttons_rfir_remote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.rfir_buttons
    ADD CONSTRAINT rfir_buttons_rfir_remote_id_fkey FOREIGN KEY (rfir_remote_id) REFERENCES public.rfir_remotes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: rfir_devices rfir_devices_command_off_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.rfir_devices
    ADD CONSTRAINT rfir_devices_command_off_id_fkey FOREIGN KEY (command_off_id) REFERENCES public.rfir_commands(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: rfir_devices rfir_devices_command_on_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.rfir_devices
    ADD CONSTRAINT rfir_devices_command_on_id_fkey FOREIGN KEY (command_on_id) REFERENCES public.rfir_commands(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: rfir_devices rfir_devices_slave_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.rfir_devices
    ADD CONSTRAINT rfir_devices_slave_id_fkey FOREIGN KEY (slave_id) REFERENCES public.slaves(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: rfir_remotes rfir_remotes_rfir_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hubot
--

ALTER TABLE ONLY public.rfir_remotes
ADD CONSTRAINT rfir_remotes_rfir_device_id_fkey FOREIGN KEY (rfir_device_id) REFERENCES public.rfir_devices(id) ON UPDATE CASCADE ON DELETE SET NULL;


CREATE SEQUENCE public.consumption_realtime_id_seq
INCREMENT 1
START 0
MINVALUE 0
MAXVALUE 99999999999
CACHE 1;

CREATE TABLE public.consumption_realtime
(
    id integer NOT NULL DEFAULT nextval('consumption_realtime_id_seq'::regclass),
    "timestamp" timestamp(0) with time zone NOT NULL DEFAULT now(),
    slave_id integer NOT NULL,
    ambient_id integer[],
    value real NOT NULL,
    CONSTRAINT consumption_realtime_pkey PRIMARY KEY (id)
);

`

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize.query(initialMigration)
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('hubot')
    }
};
