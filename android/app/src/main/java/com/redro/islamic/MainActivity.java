package com.redro.islamic;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(RedroAdhanPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
