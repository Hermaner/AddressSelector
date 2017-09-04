package com.addressselector;

import android.app.Application;
import android.support.annotation.Nullable;
import android.text.TextUtils;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            if (isDebugable()) {
                return true;
            }
            return false;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new ExtensionPackage()
                    );
        }

        @Nullable
        @Override
        protected String getBundleAssetName() {
            if (isDebugable()) {
                return super.getBundleAssetName();
            }
            return "index.android.bundle";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    public static boolean isDebugable() {
        if (TextUtils.equals("debug", BuildConfig.BUILD_TYPE.toString())) {
            return true;
        }
        return false;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
