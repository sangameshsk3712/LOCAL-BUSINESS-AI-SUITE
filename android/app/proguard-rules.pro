# ProGuard Rules for Local Business Suite AI
# Protects proprietary algorithms and keeps native JS interface intact

-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep native business bridge
-keep class com.localbiz.ai.suite.NativeBusinessBridge { *; }
-keep class com.localbiz.ai.suite.ThermalPosPrinter { *; }
-keep class com.localbiz.ai.suite.VoiceLeadRecorder { *; }
-keep class com.localbiz.ai.suite.GeoGridLocationService { *; }
-keep class com.localbiz.ai.suite.SecureStorageVault { *; }

# Keep data models
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}
