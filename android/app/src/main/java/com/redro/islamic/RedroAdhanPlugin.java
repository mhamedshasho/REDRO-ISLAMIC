package com.redro.islamic;

import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "RedroAdhan")
public class RedroAdhanPlugin extends Plugin {
    private MediaPlayer player;
    private final Handler handler = new Handler(Looper.getMainLooper());

    @PluginMethod
    public void play(PluginCall call) {
        String url = call.getString("url");
        if (url == null || !url.startsWith("https://")) {
            call.reject("Invalid audio URL");
            return;
        }

        handler.post(() -> {
            stopPlayer();
            try {
                player = new MediaPlayer();
                AudioAttributes attributes = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build();
                player.setAudioAttributes(attributes);
                player.setDataSource(getContext(), Uri.parse(url));
                player.setOnPreparedListener(MediaPlayer::start);
                player.setOnCompletionListener(mp -> stopPlayer());
                player.setOnErrorListener((mp, what, extra) -> {
                    stopPlayer();
                    call.reject("Unable to play adhan");
                    return true;
                });
                player.prepareAsync();
                JSObject result = new JSObject();
                result.put("started", true);
                call.resolve(result);
            } catch (Exception error) {
                stopPlayer();
                call.reject("Unable to play adhan", error);
            }
        });
    }

    @PluginMethod
    public void stop(PluginCall call) {
        handler.post(this::stopPlayer);
        call.resolve();
    }

    private void stopPlayer() {
        if (player != null) {
            try {
                if (player.isPlaying()) player.stop();
            } catch (Exception ignored) {}
            player.release();
            player = null;
        }
    }

    @Override
    protected void handleOnDestroy() {
        stopPlayer();
        super.handleOnDestroy();
    }
}
