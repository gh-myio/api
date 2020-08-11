    BEGIN TRANSACTION;

      -- Channels (Manual)
 INSERT INTO logs ("timestamp", "type", "action_type", "user", "slave_id", "channel", "value")
      SELECT timestamp AS timestamp,
             type AS type,
             'manual_action' AS action_type,
             NULL AS user,
             (data::json->>'slave_id')::integer AS slave_id,
             (data::json->>'channel')::integer AS channel,
             (data::json->>'value')::integer AS value
        FROM public.metadata
       WHERE type = 'manual_action'
         AND data NOT ILIKE '%dd%'
         AND data NOT ILIKE '%d\\%'
         AND data::json->>'channel' IS NOT NULL

   RETURNING *;

       -- IR Commands
      INSERT INTO logs ("timestamp", "type", "action_type", "user", "slave_id", "channel", "value", "rfir_command_id")
      SELECT timestamp AS timestamp,
             type AS type,
             data::json->>'command' AS action_type,
             "user" AS user,
             (data::json->>'id')::integer AS slave_id,
             NULL as channel,
             NULL as value,
             (data::json->>'rfir_command_id')::integer AS rfir_command_id
        FROM public.metadata
       WHERE type = 'user_action'
         AND data::json->>'type' = 'slave'
         AND data::json->>'command' = 'transmit'
   RETURNING *;

      -- Channels (User)

 INSERT INTO logs ("timestamp", "type", "action_type", "user", "slave_id", "channel", "value")
      SELECT timestamp AS timestamp,
             type AS type,
             data::json->>'command' AS action_type,
             "user" AS user,
             (data::json->>'id')::integer AS slave_id,
             (data::json->>'channel')::integer AS channel,
             (data::json->>'value')::integer AS value
        FROM public.metadata
       WHERE type = 'user_action'
         AND data::json->>'type' = 'slave'
         AND data::json->>'command' = 'light_control'
   RETURNING *;

     -- Scenes

 INSERT INTO logs ("timestamp", "type", "action_type", "user", "scene_id")
      SELECT timestamp AS timestamp,
             type AS type,
             'activate_scene' AS action_type,
             "user" AS user,
             (data::json->>'id')::integer AS scene_id
        FROM public.metadata
       WHERE type = 'user_action'
         AND data::json->>'type' = 'scene'

   RETURNING *;

   COMMIT;
